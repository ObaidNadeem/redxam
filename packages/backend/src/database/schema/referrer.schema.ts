import { Schema } from 'mongoose';

export const ReferrerSchema = new Schema({
  origin_id: {
    type: String,
    required: true,
  },
  statuses: {
    type: String,
    required: true,
  },
  referrers: {
    type: String,
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
