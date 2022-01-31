import { User } from '@/database';
import { Request } from 'express';
import { admin } from './admin.resolver';

export const overview = async (args: void, req: Request) => {
  console.debug('[Resolver] overview called');

  const adminInfo = await admin(args, req);
  // @ts-expect-error
  if (adminInfo?.err) return { err: adminInfo?.err };

  let totalUsers = (await User.countDocuments()) || 0;
  let invitedUsers = (await User.countDocuments({ accountStatus: 'invited' })) || 0;
  let acceptedUsers = (await User.countDocuments({ accountStatus: 'accepted' })) || 0;
  let usersWithBalance = (await User.countDocuments({ contribution: { $gt: 0 } })) || 0;

  return {
    totalUsers,
    invitedUsers,
    acceptedUsers,
    usersWithBalance,
  };
};
