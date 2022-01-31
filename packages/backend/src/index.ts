import 'dotenv/config';
import express from 'express';
import { connection } from 'mongoose';
import { config as appConfig } from './appConfig';
import { binanceBalanceWatcher } from './service/getTotalBalance';
// import { updateAllContributions } from './service/updateAllContributions';
import { walletWatcher } from './service/bitcoinService';
import { vaultWatcher } from './service/vaultService';
import { balanceWatcher } from './service/balanceService';
import { requestWatcher } from './service/changeRequestService';

const { PORT = '3000', SERVICE } = process.env;

const app = express();
appConfig(app);

switch (SERVICE) {
  case 'vaults':
    vaultWatcher.start();
    break;
  case 'binance':
    binanceBalanceWatcher.start();
    break;
  case 'wallets':
    walletWatcher.start();
    break;
  case 'balance':
    balanceWatcher.start();
    break;
  case 'portfolio':
    requestWatcher.start();
    break;
}

app.listen(PORT, () => {
  console.info(`Server now live on http://localhost:${PORT}/api/v1`);
});

// Start watchers once database is live
connection.on('connected', () => {
  console.info('[mongodb] connected established. starting watchers...');
  // updateAllContributions();
  console.info('[mongodb] Watching....');
});

// Stop watchers when connection to database is lost
connection.on('disconnected', () => {
  console.warn('[mongodb] connection lost. stopping watchers...');
  switch (SERVICE) {
    case 'vaults':
      vaultWatcher.stop();
      break;
    case 'binance':
      binanceBalanceWatcher.stop();
      break;
    case 'wallets':
      walletWatcher.stop();
      break;
    case 'balance':
      balanceWatcher.stop();
      break;
    case 'portfolio':
      requestWatcher.stop();
      break;
  }
});
