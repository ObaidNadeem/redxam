import { Vault } from '@/database';

export const vaults = async () => {
  const vaultsData = await Vault.find().limit(1).sort({ created_at: -1 }).lean().exec();
  const values = [];
  for await (const value of vaultsData) {
    values.push(value);
  }
  return { ...values[0] };
};
