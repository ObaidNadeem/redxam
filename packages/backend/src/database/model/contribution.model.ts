import { Document, Model, model, Types } from 'mongoose';
import { ContributionSchema } from '../schema/contribution.schema';

export interface Contribution {
  user_id: Types.ObjectId;
  contributions: number[];
}

export interface ContributionProps extends Contribution, Document {
  created_at?: Date;
  updated_at?: Date;
}

export interface ContributionModel extends Model<ContributionProps> {
}

export const Contribution = model<ContributionProps, ContributionModel>('Contribution', ContributionSchema);
