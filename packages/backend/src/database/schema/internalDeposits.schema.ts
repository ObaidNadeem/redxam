import { Schema } from 'mongoose';
import { DepositsType, DepositsCurrencyType } from '../enums';

export const InternalDepositsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: DepositsType,
      default: DepositsType.CRYPTO,
    },
    currency: {
      type: String,
      enum: DepositsCurrencyType,
      default: DepositsCurrencyType.BTC,
    },
    amount: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
