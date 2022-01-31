import Blockchair, { Hashstring } from 'blockchair-api';

export const getWalletInfo = (
  wallet: { address: Hashstring; wif: string },
  userId: string,
) => {
  return Blockchair.getWalletInfo(wallet, userId);
};
