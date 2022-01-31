import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { ReferrerSchema } from '../schema/referrer.schema';

export interface Referrer {
  origin_id: string;
  statuses: string;
  referrers: string;
}

export interface ReferrerProps extends Document, Referrer {
  created_at?: Date;
  updated_at?: Date;
}

export interface ReferrerModel extends Model<ReferrerProps> {
  findOneOrCreate: findOneOrCreate<ReferrerProps, ReferrerModel>;
}

export const Referrer = model<ReferrerProps, ReferrerModel>('referrers', ReferrerSchema);
