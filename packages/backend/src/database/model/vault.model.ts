import { Document, model, Model } from 'mongoose';
import { VaultSchema } from '../schema/vault.schema';

export interface Vault {
  token: string;
  balance: number;
  derivative: string;
  derivativeBalance: number;
}

export interface VaultProps extends Document, Vault {
  created_at?: Date;
  updated_at?: Date;
}

export const Vault = model<VaultProps>('Vault', VaultSchema);
