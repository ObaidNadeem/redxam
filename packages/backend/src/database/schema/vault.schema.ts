import { Schema } from 'mongoose';

export const Vault = new Schema({
  prevBalance: Number,
  amount: Number,
  balance: Number,
  interestRate: Number,
  token: String,
  tokenBalance: Number,
});

export const VaultSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    totalContribution: {
      type: Number,
    },
    userId: {
      type: String,
    },
    vaults: {
      aave: Vault,
      harvest: Vault,
      fulcrum: Vault,
      beefy: Vault,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
