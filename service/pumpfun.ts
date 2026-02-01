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

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  commitment: 'confirmed',
});

const provider = new AnchorProvider(solanaConnection, new NodeWallet(Keypair.generate()));

const pumpfunProgram = new Program<PUMPFUN_PROGRAM>(PUMPFUN_PROGRAM_IDL, provider);

const creatorVault = new PublicKey('5tJQUxmbx26UC1re8PkTkzbffFUeKHrhCtctPNC6iZjE');

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
  const tokenAccount = await connection.getAccountInfo(pool, 'confirmed');
  if (!tokenAccount) {
    return null;
  }
  return BondingCurveAccount.fromBuffer(tokenAccount!.data);
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
        creatorVault,
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
        creatorVault,
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
