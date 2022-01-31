import { User } from '@/database';
import { Request } from 'express';
import { admin } from '../admin.resolver/admin.resolver';

export const users = async (_: void, req: Request) => {
  console.debug('[Resolver] users called');

  const adminInfo = await admin(_, req);
  // @ts-expect-error
  if (adminInfo?.err) return { err: adminInfo?.err };

  return User.find().lean().exec();
};
