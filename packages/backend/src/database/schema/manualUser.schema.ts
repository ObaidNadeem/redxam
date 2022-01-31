import { Schema } from 'mongoose';

const ManualUserWalletSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  wif: {
    type: String,
    required: true,
  },
}, {
  _id: false,
});

export const ManualUserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  wallet: {
    type: ManualUserWalletSchema,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  verification: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: '',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
