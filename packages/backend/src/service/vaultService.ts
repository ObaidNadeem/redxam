import { Vault } from '@/database';
import { vaultCheckIn } from './contracts';
/**
 * Watches contracts vaults.
 * Use for account statistics
 */
class VaultWatcher {
  private static watcher: NodeJS.Timeout;
  private static readonly interval = 600000;
  private get watcher() {
    return VaultWatcher.watcher;
  }
  private set watcher(watcher) {
    VaultWatcher.watcher = watcher;
  }
  private async updateVault() {
    try {
      await vaultCheckIn(Vault);
    } catch (error) {
      console.log(error);
      this.stop();
    }
  }
  public async start() {
    if (this.watcher) {
      throw new Error('Vault watcher already watching!');
    }

    console.info('Starting Vault watcher...');
    await this.updateVault();
    this.watcher = setInterval(this.updateVault.bind(this), VaultWatcher.interval);
    console.info('Vault watcher started!');
  }
  public stop() {
    if (!this.watcher) {
      throw new Error('No Vault watcher running!');
    }

    console.info('Stopping Vault watcher...');
    clearInterval(this.watcher);
    this.watcher = null;
    console.info('Vault watcher stopped!');
  }
}

export const vaultWatcher = new VaultWatcher();
