import { Document, model, Model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { InternalDepositsSchema } from '../schema/internalDeposits.schema';

export interface InternalDeposits {
  userId: string;
  hash: string;
  address: string;
  type: string;
  amount: number;
  currency: string;
  timestamp: number;
}
export interface InternalDepositsProps extends Document, InternalDeposits {
  created_at?: Date;
  updated_at?: Date;
}

export interface InternalDepositsModel extends Model<InternalDepositsProps> {
  findOneOrCreate: findOneOrCreate<InternalDepositsProps, InternalDepositsModel>;
}

export const InternalDeposits = model<InternalDepositsProps, InternalDepositsModel>(
  'InternalDeposits',
  InternalDepositsSchema,
);
