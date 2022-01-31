import Blockchair from 'blockchair-api';

export const getTxsList = async currentUserWallet => {
  const userTxsList = (await Blockchair.getWalletTxs(currentUserWallet.address)).data
    .transactions;
  return Blockchair.getTxDetails(userTxsList);
};
