import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createCloseAccountInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import base58 from 'bs58';

import { Data, readJson, saveNewFile, sleep } from './service';
import { PRIVATE_KEY, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, TOKEN_MINT } from './constants';
import { PUMPFUN_CONSTANTS } from './constants/pumpfunConstants';

const connection = new Connection(RPC_ENDPOINT, { wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment: 'confirmed' });
const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY));

export const gather = async () => {
  const walletsData: Data[] = readJson();
  // export const gather = async (walletsData: Data[]) => {
  const wallets: Keypair[] = walletsData.map((wallet: Data) => Keypair.fromSecretKey(base58.decode(wallet.privateKey)));

  wallets.map(async (wallet: Keypair, i: number) => {
    try {
      const walletPublicKey = wallet.publicKey;
      // const solBalance = (await connection.getBalance(walletPublicKey)) / LAMPORTS_PER_SOL;

      while (true) {
        const solBalance = await connection.getBalance(walletPublicKey);

        if (solBalance <= 0) {
          console.log(`${walletPublicKey.toBase58()} has no SOL`);
          break;
        }

        console.log(`${walletPublicKey.toBase58()} has ${solBalance / LAMPORTS_PER_SOL} SOL`);

        // const accountInfo = await connection.getAccountInfo(walletPublicKey);
        // const tokenAccounts = await connection.getTokenAccountsByOwner(
        //   walletPublicKey,
        //   {
        //     programId: PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
        //   },
        //   'confirmed',
        // );

        let ixs: TransactionInstruction[] = [];
        // const accounts: TokenAccount[] = [];

        // if (tokenAccounts.value.length < 0) return;

        // for (const { pubkey, account } of tokenAccounts.value) {
        //   accounts.push({
        //     pubkey,
        //     programId: account.owner,
        //     accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
        //   });
        // }

        // for (let j = 0; j < accounts.length; j++) {
        const baseAta = await getAssociatedTokenAddress(
          new PublicKey(TOKEN_MINT),
          mainKp.publicKey,
          false,
          PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
        );

        const associatedTokenAccount = getAssociatedTokenAddressSync(
          new PublicKey(TOKEN_MINT),
          wallet.publicKey,
          false,
          PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
        );

        // const tokenAccount = accounts[j].pubkey;
        // console.log("tokenAccount:", tokenAccount.toBase58())
        try {
          const tokenBalance = (await connection.getTokenAccountBalance(associatedTokenAccount)).value;
          if (tokenBalance.uiAmount && tokenBalance.uiAmount > 0) {
            console.log(`${wallet.publicKey.toBase58()} has ${tokenBalance.uiAmount} tokens after sell`);
            try {
              const tokenInfo = await getAccount(
                connection,
                baseAta,
                'confirmed',
                PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
              );
              console.log('Token ATA exists on main wallet');
            } catch (error) {
              ixs.push(
                createAssociatedTokenAccountIdempotentInstruction(
                  mainKp.publicKey,
                  baseAta,
                  mainKp.publicKey,
                  new PublicKey(TOKEN_MINT),
                  PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
                ),
              );
            }

            console.log('Token Transfer Instruction');

            ixs.push(
              createTransferCheckedInstruction(
                associatedTokenAccount,
                new PublicKey(TOKEN_MINT),
                baseAta,
                wallet.publicKey,
                BigInt(tokenBalance.amount),
                tokenBalance.decimals,
                undefined,
                PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
              ),
            );
          }

          console.log(`Close Token Ata instruction`);
          const closeAtaIx = createCloseAccountInstruction(
            associatedTokenAccount,
            wallet.publicKey,
            wallet.publicKey,
            undefined,
            PUMPFUN_CONSTANTS.TOKEN_2022_PROGRAM_ID,
          );
          ixs.push(closeAtaIx);
        } catch (error) {
          console.log(`Token ATA does not exist on ${wallet.publicKey.toBase58()}`);
        }
        // let i = 0;
        // while (true) {
        //   if (tokenBalance.uiAmount == 0) break;

        //   if (i > 5) {
        //     console.log('Sell error before gather');
        //     break;
        //   }

        //   try {
        //     const sellTx = await makeSellPumpfunTokenTx(wallet, new PublicKey(TOKEN_MINT));

        //     if (sellTx == null) {
        //       throw new Error('Error in making pumpfun sell transaction');
        //     }

        //     const simResult = await connection.simulateTransaction(sellTx);

        //     if (simResult.value.err) {
        //       console.log('pumpfun sell transaction simulation error: ', simResult);
        //       throw new Error('Error in making pumpfun sell transaction');
        //     }

        //     const latestBlockhash = await connection.getLatestBlockhash();
        //     const sellTxSignature = await execute(sellTx, latestBlockhash, false);
        //     console.log(`sellTxLink: https://solscan.io/tx/${sellTxSignature ?? ''})`);
        //     break;
        //   } catch (error) {
        //     console.log('Error:', error);
        //     i++;
        //   }
        // }

        // const tokenBalanceAfterSell = (await connection.getTokenAccountBalance(accounts[j].pubkey)).value;
        // }

        // if (accountInfo) {
        console.log('Sol Tranfer Instruction');
        ixs.push(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: mainKp.publicKey,
            lamports: solBalance,
          }),
        );
        // }
        // }

        if (ixs.length) {
          const tx = new Transaction().add(
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 300_000 }),
            ComputeBudgetProgram.setComputeUnitLimit({ units: 40_000 }),
            ...ixs,
          );
          tx.feePayer = mainKp.publicKey;

          let retry = 0;
          while (retry < 5) {
            try {
              tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

              const simResult = await connection.simulateTransaction(tx);

              if (simResult.value.err) {
                console.log('simResult:', simResult);
                throw new Error('Transaction simulation failed');
              }

              const sig = await sendAndConfirmTransaction(connection, tx, [mainKp, wallet], {
                commitment: 'confirmed',
              });
              console.log(`Gathered SOL from ${wallet.publicKey.toBase58()} : https://solscan.io/tx/${sig}`);
              break;
            } catch (error) {
              retry++;
              await sleep(1000);
            }
          }
        }
      }
    } catch (error) {
      console.log('transaction error while gathering', error);
      return;
    }
  });
};

gather();
