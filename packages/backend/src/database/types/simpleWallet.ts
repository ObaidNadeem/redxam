export interface SimpleWallet {
  address: string;
  wif: string;
  txsCount: number;
}

export interface BalanceRecords {
  balance: number;
  timestamp: number;
}

export interface bankAccount {
  accessToken: String;
  accounts: [
    {
      id: String;
      name: String;
      logo: String;
      type: String;
    },
  ];
}
