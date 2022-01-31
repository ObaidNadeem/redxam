export enum DepositsType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT',
}

export enum DepositsCurrencyType {
  // CRYPTOS
  BTC = 'BTC',
  ETH = 'ETH',
  FTM = 'FTM',
  MATIC = 'ETH',
  CELO = 'CELO',
  // STABLE COINS
  cEUR = 'cEUR',
  CUSD = 'CUSD',
  USDT = 'USDT',
  DAI = 'DAI',
  USDC = 'USDC',
  // FIATS
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  AED = 'AED', // UAE Derham
}

export enum UsersPortfolios {
  PASSIVE = 'PASSIVE',
  LESSPASSIVE = 'LESSPASSIVE',
}
