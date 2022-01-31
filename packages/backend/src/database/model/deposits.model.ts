import { Document, model, Model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { DepositsSchema } from '../schema/deposits.schema';

export interface Deposits {
  userId: string;
  hash: string;
  address: string;
  type: string;
  amount: number;
  index: number;
  currency: string;
  timestamp: number;
  processedByRedxam: Boolean;
  status: string;
  bankName: string;
  bankIcon: string;
  bankType: string;
}
export interface DepositsProps extends Document, Deposits {
  created_at?: Date;
  updated_at?: Date;
}

export interface DepositsModel extends Model<DepositsProps> {
  findOneOrCreate: findOneOrCreate<DepositsProps, DepositsModel>;
}

export const Deposits = model<DepositsProps, DepositsModel>('Deposits', DepositsSchema);
