import Blockchair, { Hashstring } from 'blockchair-api';

export const broadcastTx = (txHash: Hashstring) => {
  return Blockchair.broadcastTx(txHash);
};
