import { User, UserProps, Wallet } from '@/database';
import { SimpleWallet } from '@/database/types';
import mongoose, { FilterQuery, Types } from 'mongoose';
import { getWalletInfo, generateWallet } from '@/service/wallets';
import { WalletResolver } from '../resolver/wallet.resolver';
import { BALANCE_THRESHOLD, TX_FEE, TIME_INTERVAL } from './wallets/consts';
import { Hashstring } from 'blockchair-api';
import blockchain from '../apis/blockchain';
import { consoleSandbox } from '@sentry/utils';

const USER_WALLET_QUERY = Object.freeze([
  { wallet: { $exists: true }, verification: true, accountStatus: 'accepted' },
  { _id: 1, wallet: 1, hasPendingTxs: 1 },
] as [FilterQuery<UserProps>, any]);

/**
 * Watches Bitcoin Wallet Balances.
 * If balance is higher than threshold,
 * balance will be converted to USDT.
 */
class WalletWatcher {
  private static watcher: NodeJS.Timeout;
  // TODO: Make the intervals a bit greater
  private static readonly interval = TIME_INTERVAL;
  public static wallets: {
    address: Hashstring;
    wif: string;
    userId: string;
    txsCount: number;
  }[] = [];
  private get watcher() {
    return WalletWatcher.watcher;
  }
  private set watcher(watcher) {
    WalletWatcher.watcher = watcher;
  }
  private static async getUserWallets() {
    const users = await User.find(...USER_WALLET_QUERY)
      .lean()
      .exec();
    return users.map(user => ({
      ...user.wallet,
      userId: user._id,
      hasPendingTxs: user.hasPendingTxs,
    }));
  }
  public async init() {
    console.log('INITIALIZING LIST OF WALLETS');
    WalletWatcher.wallets = await WalletWatcher.getUserWallets();
  }
  public get wallets() {
    return WalletWatcher.wallets;
  }
  public set wallets(wallets) {
    WalletWatcher.wallets = wallets;
  }
  private async updatePending(userId: string, pendingBalance: number) {
    // find user based on address
    const idStr = userId.toString();
    const foundUsers = User.findByIdAndUpdate(
      { _id: idStr },
      { pending_balance: pendingBalance },
      { upsert: true, new: true },
      function (err, result) {
        if (err) {
          console.debug('Error: ', err);
        }
      },
    );
  }
  /** Save how much un/confirmed BTC there is on each user's account. */
  private async checkWallets() {
    /**
     * Get all wallets for all users
     * Check all wallets for BTC
     * Save ammount to Mongo
     * if higher, send to binance
     */
    // TODO: Refresh list of wallets every so often
    let walletsRaw = await WalletWatcher.getUserWallets();
    if (await blockchain.isNodeOn) {
      // node case here!

      try {
        for (const wallet of walletsRaw) {
          const walletBalance = await blockchain.getAddressBalance(wallet.address);
          await this.updatePending(wallet.userId, walletBalance);

          const { checkWalletsWithNode } = WalletResolver;
          await checkWalletsWithNode(wallet, BALANCE_THRESHOLD, TX_FEE);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const wallets = walletsRaw.map(w =>
        getWalletInfo({ address: w.address, wif: w.wif }, w.userId),
      );
      try {
        const resolvedWallets = await Promise.all(wallets);
        for (const walletResponse of resolvedWallets) {
          if (walletResponse) {
            const currentUserWallet = walletsRaw.find(
              w => w.address === walletResponse.wallet.address,
            );
            // if higher move to Binance Address
            this.updatePending(walletResponse.userId, walletResponse.balance);
            // TODO: make minimum balance a .env VARIABLE
            // TODO: check if balance is not in pending tx
            // create tx
            const { checkWallets } = WalletResolver;
            await checkWallets(currentUserWallet, BALANCE_THRESHOLD, TX_FEE);
            // broadcast
          }
        }
      } catch (error) {
        console.error(error);
        console.error('Failed to broadcast this Tx!');
      }
    }
  }
  public async start() {
    if (this.watcher) {
      throw new Error('Wallet watcher already watching!');
    }

    console.info('Starting wallet watcher...');
    await this.checkWallets();
    this.watcher = setInterval(this.checkWallets.bind(this), WalletWatcher.interval);
    console.info('Wallet watcher started!');
  }
  public stop() {
    if (!this.watcher) {
      throw new Error('No Wallet watcher running!');
    }

    console.info('Stopping Wallet watcher...');
    clearInterval(this.watcher);
    this.watcher = null;
    console.info('Wallet watcher stopped!');
  }
  constructor() {
    this.init();
  }
}

export const walletWatcher = new WalletWatcher();
