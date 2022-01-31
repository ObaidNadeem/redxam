import { Datestring, Hashstring, ScripthashType } from './api';

export type WalletTxParams = [Hashstring, BCApiPagination, BCApiPagination];

export type BCWalletType =
  | 'pubkey'
  | 'pubkeyhash'
  | 'scripthash'
  | 'multisig'
  | 'nulldata'
  | 'nonstandard'
  | 'witness_v0_keyhash'
  | 'witness_v0_scripthash'
  | 'witness_unknown';

export interface BCWalletInfo extends BCWalletInfoPaginated {
  transaction_count: number;
  scripthash_type: ScripthashType | null;
}

export interface BCWalletInfoPaginated {
  type: BCWalletType;
  script_hex: string;
  balance: number;
  balance_ush: number;
  received: number;
  received_usd: number;
  spent: number;
  spent_usd: number;
  output_count: number;
  unspent_output_count: number;
  first_seen_receiving: Datestring | null;
  last_seen_receiving: Datestring | null;
  first_seen_spending: Datestring | null;
  last_seen_spending: Datestring | null;
}

export interface UnspentTransactionOutput {
  block_id: number;
  transaction_hash: string;
  index: number;
  value: number;
}

export interface BCWalletInfoResponse {
  [key: string]: {
    address: BCWalletInfo;
    transactions: Hashstring[];
    utxo: UnspentTransactionOutput[];
  };
}

export interface BCTxInfoResponse {
  [key: string]: {
    transaction: any;
    inputs: any[];
    outputs: any[];
  };
}

export interface BCWalletInfoResponsePaginated {
  addresses: Record<string, BCWalletInfoPaginated>;
  transactions: Hashstring[];
}

export interface BCApiPagination {
  tx: number;
  utxo: number;
}
