import { Document, Model, model } from 'mongoose';
import { findOneOrCreate } from '../functions/findOneOrCreate';
import { FeatureBlockSchema } from '../schema/featureBlock.schema';

export interface FeatureBlock {
  name: string;
  users: string[];
}

export interface FeatureBlockProps extends FeatureBlock, Document {
  created_at?: Date;
  updated_at?: Date;
}

export interface FeatureBlockModel extends Model<FeatureBlockProps> {
  findOneOrCreate: findOneOrCreate<FeatureBlockProps, FeatureBlockModel>;
}

export const FeatureBlock = model<FeatureBlockProps, FeatureBlockModel>(
  'FeatureBlocks',
  FeatureBlockSchema,
);
