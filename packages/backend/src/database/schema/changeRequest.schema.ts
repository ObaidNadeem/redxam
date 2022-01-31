import { Schema } from 'mongoose';
import { UsersPortfolios } from '../enums';

export const RequestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    requiredPortfolio: {
      type: String,
      enum: UsersPortfolios,
      required: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
