/**
 * Copyright (c) 2021 redxam LLC
 * oncall: dev+max
 * @format
 *
 * Updates user balances based on vault
 * balance and user contribution
 * Used for account statistics
 */

import { User } from '@/database';
import { vaults } from '../resolver/vault.resolver/vaults.resolver';

class BalanceWatcher {
  private static watcher: NodeJS.Timeout;
  private static readonly interval = 7200000;
  private get watcher() {
    return BalanceWatcher.watcher;
  }
  private set watcher(watcher) {
    BalanceWatcher.watcher = watcher;
  }
  private async updateBalance() {
    try {
      const vaultData = await vaults();
      const { totalContribution } = vaultData;
      let totalPrice = 0;
      Object.keys(vaultData.vaults).forEach(vault => {
        totalPrice += vaultData.vaults[vault].balance;
      });

      const users = await User.find(
        {},
        { _id: 1, contribution: 1, balanceRecords: { $slice: -1 } },
      );

      users.forEach(user => {
        const newBalance = (user.contribution * totalPrice) / totalContribution;
        let balance = 0;

        if (user.balanceRecords[0]) {
          const lastBalance: number = user.balanceRecords[0].balance;
          balance = newBalance >= lastBalance ? newBalance : lastBalance;
        } else balance = newBalance;

        User.updateOne(
          {
            _id: user._id,
          },
          {
            $push: {
              balanceRecords: {
                balance,
                timestamp: Date.now(),
              },
            },
          },
        );
      });
    } catch (error) {
      console.log(error);
      this.stop();
    }
  }
  public async start() {
    if (this.watcher) {
      throw new Error('Balance watcher already watching!');
    }

    console.info('Starting Balance watcher...');
    await this.updateBalance();
    this.watcher = setInterval(this.updateBalance.bind(this), BalanceWatcher.interval);
    console.info('Balance watcher started!');
  }
  public stop() {
    if (!this.watcher) {
      throw new Error('No Balance watcher running!');
    }

    console.info('Stopping Balance watcher...');
    clearInterval(this.watcher);
    this.watcher = null;
    console.info('Balance watcher stopped!');
  }
}

export const balanceWatcher = new BalanceWatcher();
