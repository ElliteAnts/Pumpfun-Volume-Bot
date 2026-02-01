import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  VersionedTransaction,
  TransactionInstruction,
  TransactionMessage,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  BUY_INTERVAL_MAX,
  BUY_INTERVAL_MIN,
  SELL_INTERVAL_MAX,
  SELL_INTERVAL_MIN,
  BUY_LOWER_PERCENT,
  BUY_UPPER_PERCENT,
  DISTRIBUTE_WALLET_NUM,
  PRIVATE_KEY,
  RPC_ENDPOINT,
  RPC_WEBSOCKET_ENDPOINT,
  TOKEN_MINT,
  DISTRIBUTE_INTERVAL_MIN,
  DISTRIBUTE_INTERVAL_MAX,
  FEE_LEVEL,
} from './constants';
import { Data, saveDataToFile, sleep } from './service';
import base58 from 'bs58';
import { execute } from './executor/legacy';
import { makeBuyPumpfunTokenTx, makeSellPumpfunTokenTx } from './service/pumpfun';

interface SubWallet {
  kp: Keypair;
  buyAmount: number;
}

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  commitment: 'confirmed',
});

export const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY));
const baseMint = new PublicKey(TOKEN_MINT);
const distritbutionNum = DISTRIBUTE_WALLET_NUM > 20 ? 20 : DISTRIBUTE_WALLET_NUM;

const retryLimits = 5;

const main = async () => {
  console.log(`Volume bot is running`);
  console.log(`Wallet address: ${mainKp.publicKey.toBase58()}`);
  console.log(`CA: ${baseMint.toBase58()}`);
  console.log(`Distribute SOL to ${distritbutionNum} wallets`);

  console.log(`===================== Cycle Started =======================`);
  try {
    console.log(`------------------------------Sol Distribution---------------------------`);
    const { subWallets, data } = await distributeSol(solanaConnection, mainKp, distritbutionNum);

    const interval = Math.floor(
      (DISTRIBUTE_INTERVAL_MIN + Math.random() * (DISTRIBUTE_INTERVAL_MAX - DISTRIBUTE_INTERVAL_MIN)) * 1000,
    );

    subWallets.map(async (subwallet: SubWallet, index: number) => {
      const { kp, buyAmount } = subwallet;
      await sleep(Math.round(((index * BUY_INTERVAL_MAX) / DISTRIBUTE_WALLET_NUM) * 1000));
      55;
      const BUY_WAIT_INTERVAL = Math.round(Math.random() * (BUY_INTERVAL_MAX - BUY_INTERVAL_MIN) + BUY_INTERVAL_MIN);
      const SELL_WAIT_INTERVAL = Math.round(
        Math.random() * (SELL_INTERVAL_MAX - SELL_INTERVAL_MIN) + SELL_INTERVAL_MIN,
      );

      const subWalletBalance = await solanaConnection.getBalance(kp.publicKey);
      const buyAmountInPercent = Number(
        (Math.random() * (BUY_UPPER_PERCENT - BUY_LOWER_PERCENT) + BUY_LOWER_PERCENT).toFixed(3),
      );

      if (subWalletBalance <= 5 * 10 ** 6) {
        console.log('SubWallet Sol Balance is not enough');
        return;
      }

      let buyAmountFirst = Math.floor(((subWalletBalance - 5 * 10 ** 6) / 100) * buyAmountInPercent);
      let buyAmountSecond = Math.floor(subWalletBalance - buyAmountFirst - 5 * 10 ** 6);

      console.log(
        `${kp.publicKey}\nTotalBalance = ${subWalletBalance / LAMPORTS_PER_SOL}\nFirst Buy Amount = ${buyAmountFirst / LAMPORTS_PER_SOL}\nSecond Buy Amount = ${buyAmountSecond / LAMPORTS_PER_SOL}`,
      );

      console.log(`------------------------------Token First Buying-------------------------`);

      let retryForFirstBuy = 0;
      while (true) {
        try {
          if (retryForFirstBuy < retryLimits) {
            throw new Error('Pumpfun buy tx retry limited');
          }

          await buy(kp, baseMint, buyAmountFirst / LAMPORTS_PER_SOL);
          break;
        } catch (error) {
          await sleep(1000);
          retryForFirstBuy++;
        }
      }

      await sleep(BUY_WAIT_INTERVAL * 1000);

      console.log(`------------------------------Token Second Buying------------------------`);

      let retryForSecondBuy = 0;
      while (true) {
        try {
          if (retryForSecondBuy < retryLimits) {
            throw new Error('Pumpfun Token First Buy Tx Retry limited');
          }

          await buy(kp, baseMint, buyAmountSecond / LAMPORTS_PER_SOL);
          break;
        } catch (error) {
          await sleep(1000);
          retryForSecondBuy++;
        }
      }

      await sleep(SELL_WAIT_INTERVAL * 1000);

      let retryForSell = 0;
      console.log(`------------------------------Token Selling------------------------------`);
      while (true) {
        try {
          if (retryForSell < retryLimits) {
            throw new Error('Pumpfun Token Second Buy Tx Retry limited');
          }

          await sell(baseMint, kp);
          break;
        } catch (error) {
          await sleep(1000);
          retryForSell++;
        }
      }

      console.log(`===================== Cycle Finished =======================`);
    });
  } catch (error) {
    console.log('Error in a cycle', error);
    return;
  }
};

const distributeSol = async (connection: Connection, mainKp: Keypair, distritbutionNum: number) => {
  const data: Data[] = [];
  const subWallets: SubWallet[] = [];
  const mainWalletPubkey = mainKp.publicKey;
  const sendSolTx: TransactionInstruction[] = [];

  try {
    sendSolTx.push(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 * FEE_LEVEL }),
      ComputeBudgetProgram.setComputeUnitLimit({ units: 12_000 }),
    );
    const mainWalletSolBalance = await connection.getBalance(mainWalletPubkey);
    console.log('🚀 mainWalletSolBalance:', mainWalletSolBalance / LAMPORTS_PER_SOL);
    if (mainWalletSolBalance <= 5 * 10 ** 6) {
      throw new Error('Main wallet balance is not enough');
    }

    const distributionMaxSolAmount = Math.floor((mainWalletSolBalance - 5 * 10 ** 6) / distritbutionNum);

    for (let i = 0; i < distritbutionNum; i++) {
      const wallet = Keypair.generate();
      const distributionSolAmount = Math.floor(distributionMaxSolAmount * (1 - Math.random() * 0.2));

      data.push({
        privateKey: base58.encode(wallet.secretKey),
        pubkey: wallet.publicKey.toBase58(),
      });

      subWallets.push({ kp: wallet, buyAmount: distributionSolAmount });

      sendSolTx.push(
        SystemProgram.transfer({
          fromPubkey: mainKp.publicKey,
          toPubkey: wallet.publicKey,
          lamports: distributionSolAmount,
        }),
      );
    }

    saveDataToFile(data);

    const latestBlockhash = await solanaConnection.getLatestBlockhash();
    const distributionTx = new VersionedTransaction(
      new TransactionMessage({
        payerKey: mainKp.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: sendSolTx,
      }).compileToV0Message(),
    );
    distributionTx.sign([mainKp]);

    const distributeTxSignature = await execute(distributionTx, latestBlockhash, 1);
    console.log(`Success in distribution: https://solscan.io/tx/${distributeTxSignature ?? ''}`);
    subWallets.forEach((subWallet, index) => {
      console.log(`Wallet ${index + 1} Pubkey: ${subWallet.kp.publicKey.toBase58()}, Balance: ${subWallet.buyAmount}`);
    });
    console.log(`-------------------------------------------------------------------------`);

    return {
      subWallets,
      data,
    };
  } catch (error) {
    console.log('Error in Sol Distribution:', error);
    throw new Error('Error in Sol Distribution');
  }
};

const buy = async (wallet: Keypair, baseMint: PublicKey, buyAmount: number) => {
  try {
    const solBalance = (await solanaConnection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL;

    if (solBalance <= 0.00001) throw new Error('SubWallet Sol Balance is not enough');

    const buyTx = await makeBuyPumpfunTokenTx(wallet, baseMint, buyAmount);
    const simulateBuyTx = await solanaConnection.simulateTransaction(buyTx);

    if (simulateBuyTx.value.err) {
      console.log(`Simulation Result of Buy Transaction on ${wallet.publicKey.toBase58()}: ${simulateBuyTx}`);
      throw new Error('Error in Buy Transaction Simulation');
    }

    const latestBlockhash = await solanaConnection.getLatestBlockhash();
    const txSignature = await execute(buyTx, latestBlockhash, 1);
    if (txSignature) {
      console.log(`Success in buy transaction: https://solscan.io/tx/${txSignature}`);
      return txSignature;
    } else {
      throw new Error('Error in confirm transaction:');
    }
  } catch (error) {
    console.log(`Error in Pumpfun token buy transaction: ${error}`);
    throw new Error('Pumpfun token buy transaction failed');
  }
};

const sell = async (baseMint: PublicKey, wallet: Keypair) => {
  try {
    let sellTx = await makeSellPumpfunTokenTx(wallet, baseMint);

    const simulateSellTx = await solanaConnection.simulateTransaction(sellTx);

    if (simulateSellTx.value.err) {
      console.log(`Simulation Result of Sell Transaction on ${wallet.publicKey.toBase58()}: ${simulateSellTx}`);
      throw new Error('Error in Sell Transaction Simulation');
    }

    const latestBlockhash = await solanaConnection.getLatestBlockhash();
    const txSignature = await execute(sellTx, latestBlockhash, 1);
    if (txSignature) {
      console.log(`Success in sell transaction: https://solscan.io/tx/${txSignature}`);
      return txSignature;
    } else {
      throw new Error('Error in confirm transaction:');
    }
  } catch (error) {
    console.log(`Error in Pumpfun token sell transaction: ${error}`);
    throw new Error('Pumpfun token sell transaction failed');
  }
};

main();
