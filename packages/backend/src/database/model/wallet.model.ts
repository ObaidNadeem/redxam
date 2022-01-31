import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { WalletSchema } from '../schema/wallet.schema';

export interface Wallet {
  address: string;
  transactions_count?: number;
  confirmed_balance?: number;
  total_received?: number;
  total_spent?: number;
  incoming_transactions_count?: number;
  outgoing_transactions_count?: number;
}

export interface WalletProps extends Document, Wallet {
  created_at?: Date;
  updated_at?: Date;
}

export interface WalletModel extends Model<WalletProps> {
  findOneOrCreate: findOneOrCreate<WalletProps, WalletModel>;
}

export const Wallet = model<WalletProps, WalletModel>('Wallet', WalletSchema);
