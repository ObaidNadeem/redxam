import { Token } from "./token";
import { BitcoinBitcoinMainnetToken } from "./bitcoin-bitcoin-mainnet.token";

export class BitcoinBitcoinTestnetToken
  extends BitcoinBitcoinMainnetToken
  implements Token {
  readonly isTestNet;

  constructor() {
    super();
    this.isTestNet = true;
  }
}
