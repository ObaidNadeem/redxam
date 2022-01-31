require('dotenv').config();
import axios from 'axios';
import blockchain from '../../apis/blockchain';
import { getTxsList } from './getTxsList';
import { deposit, updateUserDeposits } from '../../service/wallets';

export const WalletResolver = {
  checkWallets: async (currentUserWallet, BALANCE_THRESHOLD, TX_FEE) => {
    const txsList = await getTxsList(currentUserWallet);

    await updateUserDeposits(txsList, currentUserWallet);
    await deposit(txsList, currentUserWallet, BALANCE_THRESHOLD, TX_FEE);
  },
  checkWalletsWithNode: async (currentUserWallet, BALANCE_THRESHOLD, TX_FEE) => {
    const txsList = await blockchain.getTxByAddress(currentUserWallet.address);

    if (txsList.status !== 200) return null;

    await updateUserDeposits(txsList.txs, currentUserWallet, true);
    await deposit(txsList.txs, currentUserWallet, BALANCE_THRESHOLD, TX_FEE, true);
  },
};
