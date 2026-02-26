import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction } from '@solana/spl-token';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { PUMPFUN_PROGRAM, PUMPFUN_PROGRAM_IDL } from '../idls/pumpfunIdl';
import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from '../constants';
import { PUMPFUN_CONSTANTS } from '../constants/pumpfunConstants';
import { BondingCurveAccount } from './bondingCurveAccount';
import { deserializeMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { lamports, publicKey } from "@metaplex-foundation/umi";

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  commitment: 'confirmed',
});
const provider = new AnchorProvider(solanaConnection, new NodeWallet(Keypair.generate()));
const pumpfunProgram = new Program<PUMPFUN_PROGRAM>(PUMPFUN_PROGRAM_IDL, provider);
const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

type CreatorSource = "metadata_verified_creator" | "metadata_first_creator" | "metadata_update_authority" | "indexer" | "oldest_tx_signer";

async function getMetadataCreator(mint: PublicKey): Promise<{ creator: string; source: CreatorSource } | null> {
  const [metadataPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );

  const info = await solanaConnection.getAccountInfo(metadataPda, "confirmed");
  if (!info) return null;

  const md = deserializeMetadata({
    publicKey: publicKey(metadataPda.toBase58()),
    owner: publicKey(info.owner.toBase58()),
    lamports: lamports(info.lamports),
    executable: info.executable,
    data: new Uint8Array(info.data),
  });

  if (md.creators.__option === "Some" && md.creators.value.length > 0) {
    const verified = md.creators.value.find((c) => c.verified);
    if (verified) {
      return { creator: verified.address, source: "metadata_verified_creator" };
    }

    return { creator: md.creators.value[0].address, source: "metadata_first_creator" };
  }

  return { creator: md.updateAuthority, source: "metadata_update_authority" };
}

async function getIndexerCreator(mint: PublicKey): Promise<{ creator: string; source: CreatorSource } | null> {
  const heliusApiKey = process.env.HELIUS_API_KEY;
  if (!heliusApiKey) return null;

  // Uses DAS endpoint for creator metadata in one indexed query.
  const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "token-creator",
      method: "getAsset",
      params: { id: mint.toBase58() },
    }),
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    result?: {
      creators?: Array<{ address: string; verified: boolean }>;
      authorities?: Array<{ address: string }>;
    };
  };

  const creators = json.result?.creators ?? [];
  const verified = creators.find((c) => c.verified)?.address;
  if (verified) {
    return { creator: verified, source: "indexer" };
  }

  if (creators[0]?.address) {
    return { creator: creators[0].address, source: "indexer" };
  }

  const authority = json.result?.authorities?.[0]?.address;
  if (authority) {
    return { creator: authority, source: "indexer" };
  }

  return null;
}

async function getOldestTxSignerCreator(mint: PublicKey): Promise<{ creator: string; source: CreatorSource } | null> {
  let before: string | undefined;
  let oldestSig: string | undefined;

  while (true) {
    const page = await solanaConnection.getSignaturesForAddress(mint, { before, limit: 1000 }, "confirmed");
    if (page.length === 0) break;

    oldestSig = page[page.length - 1].signature;

    if (page.length < 1000) break;
    before = oldestSig;
  }

  if (!oldestSig) return null;

  const tx = await solanaConnection.getParsedTransaction(oldestSig, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  const signer = tx?.transaction.message.accountKeys.find((k) => k.signer)?.pubkey;
  if (!signer) return null;

  return { creator: signer.toBase58(), source: "oldest_tx_signer" };
}

export async function getTokenCreator(mintInput: string | PublicKey): Promise<{ creator: string; source: CreatorSource }> {
  const mint = typeof mintInput === "string" ? new PublicKey(mintInput) : mintInput;

  const metadataCreator = await getMetadataCreator(mint);
  if (metadataCreator) return metadataCreator;

  const indexerCreator = await getIndexerCreator(mint);
  if (indexerCreator) return indexerCreator;

  const txCreator = await getOldestTxSignerCreator(mint);
  if (txCreator) return txCreator;

  throw new Error("Token creator not found from metadata, indexer, or tx history");
}

export function calculateUserVolumePda(userPublicKey: any) {
  const discriminator = Buffer.from([
    117, 115, 101, 114, 95, 118, 111, 108, 117, 109, 101, 95, 97, 99, 99, 117, 109, 117, 108, 97, 116, 111, 114,
  ]);
  const [pda] = PublicKey.findProgramAddressSync(
    [discriminator, userPublicKey.toBuffer()],
    PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
  );
  return pda;
}

export const getBondingCurveAccount = async (connection: Connection, mint: PublicKey) => {
  const pool = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), mint.toBuffer()],
    PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
  )[0];

  const info = await connection.getAccountInfo(pool, 'confirmed');

  if (!info) {
    return null;
  }

  return BondingCurveAccount.fromBuffer(info.data);
};

export const makeBuyPumpfunTokenTx = async (payer: Keypair, mintPublickey: PublicKey, buyAmount: number) => {
  try {
    const buyAmountInLamports = new BN(Math.round(buyAmount * LAMPORTS_PER_SOL));
    const bondingCurveAccount = await getBondingCurveAccount(solanaConnection, mintPublickey);

    if (!bondingCurveAccount) throw new Error('No Token BondingCurve Account');

    // Prepare arguments for the buy method.
    // Method expects: amount (BN), max_sol_cost (BN), track_volume ({ 0: boolean })
    const amount = bondingCurveAccount.getBuyPrice(BigInt(buyAmountInLamports.toString())) / BigInt(2);
    console.log(`buyAmount: ${buyAmount}\nTokenOutMinAmount: ${(amount * BigInt(2)) / BigInt(1000000)}`);
    const trackVolume = { 0: true };

    const [bondingCurve] = await PublicKey.findProgramAddress(
      [Buffer.from('bonding-curve'), mintPublickey.toBuffer()],
      PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
    );

    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
      [bondingCurve.toBuffer(), PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID.toBuffer(), mintPublickey.toBuffer()],
      PUMPFUN_CONSTANTS.ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const tokenAccountAddress = getAssociatedTokenAddressSync(
      mintPublickey,
      payer.publicKey,
      false,
      PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
    );

    const userVolumePda = calculateUserVolumePda(payer.publicKey);
    const tokenCreator = await getTokenCreator(mintPublickey);

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("creator-vault"), new PublicKey(tokenCreator.creator).toBuffer()],
      PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID
    )

    if (!vault) {
      throw new Error(`No vault PDA found for creator ${tokenCreator.creator}`);
    }

    const buyInstruction = await pumpfunProgram.methods
      .buy(new BN(amount.toString()), buyAmountInLamports, trackVolume)
      .accountsStrict({
        global: PUMPFUN_CONSTANTS.GLOBAL_PDA,
        feeRecipient: PUMPFUN_CONSTANTS.FEE_RECIPIENT,
        mint: mintPublickey,
        bondingCurve,
        associatedBondingCurve,
        associatedUser: tokenAccountAddress,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
        creatorVault: vault,
        eventAuthority: PUMPFUN_CONSTANTS.EVENT_AUTHORITY,
        program: PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
        globalVolumeAccumulator: PUMPFUN_CONSTANTS.GLOBAL_FEE_ACCUMULATOR,
        userVolumeAccumulator: userVolumePda,
        feeConfig: PUMPFUN_CONSTANTS.FEE_CONFIG,
        feeProgram: PUMPFUN_CONSTANTS.FEE_PROGRAM,
      })
      .instruction();

    const recentBlockhash = await solanaConnection.getLatestBlockhash();

    const ATAInstruction = createAssociatedTokenAccountIdempotentInstruction(
      payer.publicKey,
      tokenAccountAddress,
      payer.publicKey,
      mintPublickey,
      PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
    );

    const buyTx = new VersionedTransaction(
      new TransactionMessage({
        instructions: [
          ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
          ATAInstruction,
          buyInstruction,
        ],
        payerKey: payer.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
      }).compileToV0Message(),
    );

    buyTx.sign([payer]);

    return buyTx;
  } catch (error) {
    console.log('Error while making buy transaction in pumpfun', error);
    throw new Error('Error while making buy transaction in pumpfun');
  }
};

export const makeSellPumpfunTokenTx = async (payer: Keypair, mintPublickey: PublicKey) => {
  try {
    const associatedUser = getAssociatedTokenAddressSync(
      mintPublickey,
      payer.publicKey,
      false,
      PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
    );

    const balance = await solanaConnection.getTokenAccountBalance(associatedUser);

    console.log('SellAmount:', BigInt(balance.value.amount) / BigInt(2) / BigInt(100000));

    const [bondingCurve] = await PublicKey.findProgramAddress(
      [Buffer.from('bonding-curve'), mintPublickey.toBuffer()],
      PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
    );

    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
      [bondingCurve.toBuffer(), PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID.toBuffer(), mintPublickey.toBuffer()],
      PUMPFUN_CONSTANTS.ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    const tokenCreator = await getTokenCreator(mintPublickey);

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("creator-vault"), new PublicKey(tokenCreator.creator).toBuffer()],
      PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID
    )

    if (!vault) {
      throw new Error(`No vault PDA found for creator ${tokenCreator.creator}`);
    }

    const sellIx = await pumpfunProgram.methods
      .sell(new BN(balance.value.amount), new BN(0))
      .accountsStrict({
        global: PUMPFUN_CONSTANTS.GLOBAL_PDA,
        feeRecipient: PUMPFUN_CONSTANTS.FEE_RECIPIENT,
        mint: mintPublickey,
        bondingCurve,
        associatedBondingCurve,
        associatedUser,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
        creatorVault: vault,
        eventAuthority: PUMPFUN_CONSTANTS.EVENT_AUTHORITY,
        program: PUMPFUN_CONSTANTS.PUMPFUN_PROGRAM_ID,
        feeConfig: PUMPFUN_CONSTANTS.FEE_CONFIG,
        feeProgram: PUMPFUN_CONSTANTS.FEE_PROGRAM,
      })
      .instruction();

    const recentBlockhash = await solanaConnection.getLatestBlockhash();

    const sellTx = new VersionedTransaction(
      new TransactionMessage({
        instructions: [
          ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 100_000 }),
          sellIx,
        ],
        payerKey: payer.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
      }).compileToV0Message(),
    );

    sellTx.sign([payer]);

    return sellTx;
  } catch (error) {
    console.log('Error while making sell transaction in pumpfun:', error);
    throw new Error('Error while making sell transaction in pumpfun');
  }
};
