import { Document, model } from 'mongoose';
import { RequestSchema } from '../schema/changeRequest.schema';

export interface ChangeRequest {
  userId: string;
  timestamp: number;
  requiredPortfolio: string;
  emailSent?: boolean;
  processed?: boolean;
}

export interface ChangeRequestProps extends Document, ChangeRequest {
  created_at?: Date;
  updated_at?: Date;
}

export const ChangeRequest = model<ChangeRequestProps>('ChangeRequest', RequestSchema);
