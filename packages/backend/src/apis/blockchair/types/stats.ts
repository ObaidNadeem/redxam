import { Datestring } from './api';

export interface BCStats {
  blocks: number;
  transactions: number;
  outputs: number;
  circulation: number;
  blocks_24h: number;
  transactions_24h: number;
  difficulty: number;
  volume_24h: number;
  mempool_transactions: number;
  mempool_size: number;
  mempool_tps: number;
  mempool_total_fee_usd: number;
  best_block_height: number;
  best_block_hash: number;
  best_block_time: Datestring;
  blockchain_size: number;
  average_transaction_fee_24h: number;
  inflation_24h: number;
  median_transaction_fee_24h: number;
  cdd_24h: number;
  largest_transaction_24h: {
    hash: string;
    value_usd: number;
  };
  hashrate_24h: string;
  inflation_usd_24h: number;
  average_transaction_fee_usd_24h: number;
  median_transaction_fee_usd_24h: number;
  market_price_usd: number;
  market_price_btc: number;
  market_price_usd_change_24h_percentage: number;
  market_cap_usd: number;
  market_dominance_percentage: number;
  next_retarget_time_estimate: Datestring;
  next_difficulty_estimate: number;
  suggested_transaction_fee_per_byte_sat: number;
  holding_addresses: number;
}
