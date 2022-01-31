import { Schema } from 'mongoose';
import { Document, model } from 'mongoose';

export const btcDumpsSchema = new Schema(
  { any: {} },
  {
    strict: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export interface btcDumps {
  resolvedWallets: any;
}
export interface btcDumpsProps extends Document, btcDumps {
  created_at?: Date;
  updated_at?: Date;
}

export const btcDumps = model<btcDumpsProps>('btcDumps', btcDumpsSchema);
