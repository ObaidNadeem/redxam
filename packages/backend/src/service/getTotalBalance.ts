import { binance } from '@/config/binance';
import { TotalPrice } from '@/database';

// TODO: Move this
interface BalanceParams {
  price: number;
  currency: 'USDT' | 'BTC';
}

/**
 * Watches Binance Balances.
 * Use for account statistics
 */
class BalanceWatcher {
  private static watcher: NodeJS.Timeout;
  private static readonly interval = 60000;
  private get watcher() {
    return BalanceWatcher.watcher;
  }
  private set watcher(watcher) {
    BalanceWatcher.watcher = watcher;
  }
  private async updatePrice(options: BalanceParams) {
    await TotalPrice.updateOne(
      { name: options.currency },
      {
        $set: { price: options.price.toString() },
        $setOnInsert: { contribution: '0' },
      },
      { upsert: true },
    );
  }
  private async updateBalance() {
    const balances = await binance.balance();
    const balanceUSDT = balances.find(balance => balance.asset === 'USDT');
    const balanceBTC = balances.find(balance => balance.asset === 'BTC');
    const totalBalanceUSDT = Number(
      (Number(balanceUSDT.free) + Number(balanceUSDT.locked)).toFixed(2),
    );
    const totalBalanceBTC = Number(Number(balanceBTC.free) + Number(balanceBTC.locked));

    try {
      await this.updatePrice({ price: totalBalanceBTC, currency: 'BTC' });
      console.debug('New Balance BTC:', totalBalanceBTC);
      await this.updatePrice({ price: totalBalanceUSDT, currency: 'USDT' });
      console.debug('New Balance USDT:', totalBalanceUSDT);
    } catch (error) {
      console.error('Failed to update total balance!');
      console.error('Mongo Error:', error.message);
    }
  }
  public async start() {
    if (this.watcher) {
      throw new Error('Balance watcher already watching!');
    }

    console.info('Starting balance watcher...');
    await this.updateBalance();
    this.watcher = setInterval(this.updateBalance.bind(this), BalanceWatcher.interval);
    console.info('Balance watcher started!');
  }
  public stop() {
    if (!this.watcher) {
      throw new Error('No balance watcher running!');
    }

    console.info('Stopping balance watcher...');
    clearInterval(this.watcher);
    this.watcher = null;
    console.info('Balance watcher stopped!');
  }
}

export const binanceBalanceWatcher = new BalanceWatcher();
