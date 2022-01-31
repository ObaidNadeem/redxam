import { Token } from "./tokens/token";
import { BitcoinBitcoinMainnetToken }
  from "./tokens/bitcoin-bitcoin-mainnet.token";
import { BitcoinBitcoinTestnetToken }
  from "./tokens/bitcoin-bitcoin-testnet.token";
import { EthereumEthereumMainnetToken }
  from "./tokens/ethereum-ethereum-mainnet.token";
import { PolygonMaticMainnetToken } from "./tokens/matic-polygon-mainnet.token";

const tokens: Token[] = [
  new BitcoinBitcoinMainnetToken(),
  new BitcoinBitcoinTestnetToken(),
  new EthereumEthereumMainnetToken(),
  new PolygonMaticMainnetToken()
];

const table = tokens.map(token => ({
  Name: token.name,
  Symbol: token.symbol,
  Network: token.network,
  Testnet: token.isTestNet
}));

console.table(table);
