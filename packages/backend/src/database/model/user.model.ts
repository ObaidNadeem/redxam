import { Document, model, Model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { UserSchema } from '../schema/user.schema';
import { SimpleWallet, BalanceRecords, bankAccount } from '../types';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  wallet: SimpleWallet;
  contribution?: number;
  level: number;
  verification?: boolean;
  token: string;
  pending_balance: number;
  balance: number;
  accountBalance: number;
  accountStatus?: string;
  hasPendingTxs?: boolean;
  balanceRecords?: [BalanceRecords];
  bankAccounts?: [bankAccount];
  deposited: number;
  withdrawn: number;
  birthPlace?: string;
  title?: string;
  address?: string;
  nearestLandmark?: string;
  state?: string;
  marriedStatus?: string;
  occupation?: string;
  identityIDType?: string;
  identityIDNumber?: string;
  issuance?: string;
  issuancePlace?: string;
  issuanceDate?: string;
  issuanceStatus?: string;
  expiringDate?: string;
  portfolio?: string;
  waitlistToken: string;
  referralCode: string;
  referralId?: string;
  mxId?: string;
}

export interface UserProps extends Document, User {
  created_at?: Date;
  updated_at?: Date;
}

export interface UserModel extends Model<UserProps> {
  findOneOrCreate: findOneOrCreate<UserProps, UserModel>;
}

export const User = model<UserProps, UserModel>('User', UserSchema);
