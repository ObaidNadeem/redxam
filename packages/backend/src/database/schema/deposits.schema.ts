import { Schema } from 'mongoose';
import { DepositsType, DepositsCurrencyType } from '../enums';

export const DepositsSchema = new Schema(
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
    index: {
      type: Number,
      required: false,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    processedByRedxam: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      type: String,
      required: true,
    },
    stripeChargeId: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    bankIcon: {
      type: String,
      required: false,
    },
    bankType: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
