import { messages } from '@/config/messages';
import { ManualUser } from '@/database';
import { SimpleWallet } from '@/database/types';
import { generateWallet } from '@/service/wallets';
import { Argument, NewManualUser } from '../types';

const checkUserExists = async (user: NewManualUser) => {
  const { name, email, phone } = user;
  return ManualUser.exists({ $or: [{ name }, { email }, { phone }] });
};

const createNewUser = async (user: NewManualUser, wallet: SimpleWallet, level: number) => {
  await ManualUser.create({ ...user, wallet, level });
};

const getLastOrder = async () => {
  const user = await ManualUser
    .findOne({}, { _id: 0, level: 1 })
    .sort({ level: -1 })
    .lean()
    .exec();

  return user?.level ?? 0;
};

export const createManualUser = async ({ arg }: Argument<NewManualUser>) => {
  console.debug('[Resolver] createManualUser called');

  if (!await checkUserExists(arg)) {
    return messages.failed.manualUser.existed;
  }

  const wallet = generateWallet();
  const lastOrder = await getLastOrder();

  return createNewUser(arg, wallet, lastOrder + 1)
    .then(() => messages.success.register)
    .catch(() => messages.failed.general);
};
