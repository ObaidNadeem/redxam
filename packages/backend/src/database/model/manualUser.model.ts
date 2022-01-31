import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { ManualUserSchema } from '../schema/manualUser.schema';
import { SimpleWallet } from '../types';

export interface ManualUser {
  name: string;
  email: string;
  phone: string;
  wallet: SimpleWallet;
  level: number;
  verification?: boolean;
  token?: string;
}

export interface ManualUserProps extends ManualUser, Document {
  created_at?: Date;
  updated_at?: Date;
}

export interface ManualUserModel extends Model<ManualUserProps> {
  findOneOrCreate: findOneOrCreate<ManualUserProps, ManualUserModel>;
}

export const ManualUser = model<ManualUserProps, ManualUserModel>('ManualUser', ManualUserSchema, 'manual_users');
