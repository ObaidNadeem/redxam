import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { AdminSchema } from '../schema/admin.schema';

export interface Admin {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
  token?: string;
}

export interface AdminProps extends Admin, Document {
  created_at?: Date;
  updated_at?: Date;
}

export interface AdminModel extends Model<AdminProps> {
  findOneOrCreate: findOneOrCreate<AdminProps, AdminModel>;
}

export const Admin = model<AdminProps, AdminModel>('Admins', AdminSchema);
