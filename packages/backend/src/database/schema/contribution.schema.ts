import { Schema } from 'mongoose';

export const ContributionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  contributions: {
    type: [Number],
    default: [],
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
