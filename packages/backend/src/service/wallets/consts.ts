const { networks } = require('bitcoinjs-lib');

// BTC Chain Constants
const { BINANCE_ADDRESS, BINANCE_TESTNET_ADDRESS, NODE_ENV } = process.env;
const IS_PRODUCTION = NODE_ENV === 'production';
export const NETWORK = networks[IS_PRODUCTION ? 'bitcoin' : 'testnet'];
export const REDXAM_ADDRESS = IS_PRODUCTION ? BINANCE_ADDRESS : BINANCE_TESTNET_ADDRESS;
export const TX_FEE = IS_PRODUCTION ? 21694 : 4095;
export const BALANCE_THRESHOLD = IS_PRODUCTION ? 1000000 : 2500;
export const TIME_INTERVAL = IS_PRODUCTION ? 600000 : 25000;
