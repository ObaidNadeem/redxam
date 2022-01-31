import { Schema } from 'mongoose';

export const WalletSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  transactions_count: {
    type: Number,
    default: 0,
  },
  confirmed_balance: {
    type: Number,
    default: 0,
  },
  total_received: {
    type: Number,
    default: 0,
  },
  total_spent: {
    type: Number,
    default: 0,
  },
  incoming_transactions_count: {
    type: Number,
    default: 0,
  },
  outgoing_transactions_count: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
