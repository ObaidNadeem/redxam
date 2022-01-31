import { Schema } from 'mongoose';

export const FeatureBlockSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
