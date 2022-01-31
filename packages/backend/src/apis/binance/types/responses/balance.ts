export interface BalanceResponse {
  accountAlias: string;
  asset: string;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export interface Balance {
  accountAlias: string;
  asset: string;
  balance: number;
  crossWalletBalance: number;
  crossUnPnl: number;
  availableBalance: number;
  maxWithdrawAmount: number;
  marginAvailable: boolean;
  updateTime: Date;
}

interface CryptoBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface BinanceAccount {
  makerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: Date;
  accountType: string;
  balances: CryptoBalance[];
}
