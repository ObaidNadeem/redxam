import { SimpleWallet } from '@/database/types';
import { ECPair, payments } from 'bitcoinjs-lib';
import { NETWORK } from './consts';

/**
 *
 * @returns new BTC wallet
 * From: https://gist.github.com/bitgord/7cc3b4269b22765613a1340d6695865e
 */
export const generateWallet = () => {
  const keyPair = ECPair.makeRandom({ network: NETWORK });

  const { address } = payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
  const wif = keyPair.toWIF();

  return { address, wif, txsCount: 0 } as SimpleWallet;
};
