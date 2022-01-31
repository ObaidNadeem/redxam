import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { TotalPriceSchema } from '../schema/totalPrice.schema';

export interface TotalPrice {
  name: string;
  price: string;
  contribution?: string;
}

export interface TotalPriceProps extends Document, TotalPrice {
  created_at?: Date;
  updated_at?: Date;
}

export interface TotalPriceModel extends Model<TotalPriceProps> {
  findOneOrCreate: findOneOrCreate<TotalPriceProps, TotalPriceModel>;
}

export const TotalPrice = model<TotalPriceProps, TotalPriceModel>('TotalPrice', TotalPriceSchema, 'total_prices');
