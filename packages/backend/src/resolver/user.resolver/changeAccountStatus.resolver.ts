import { Argument } from '../types';
import { Request } from 'express';
import { JWT } from '@/config/jwt';
import { User } from '@/database';
import { generateCode } from '@/utils/helpers';

export const changeAccountStatus = async ({ arg }: Argument<String>, req: Request) => {
  console.debug('[Resolver] changeAccountStatus called');

  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  try {
    let userData = await User.findOne({ _id: payload.userId });
    if (userData.accountStatus !== 'invited')
      return { success: false, message: 'account not invited' };

    let correctCode = generateCode(userData.email);

    if (!arg.length || arg.toUpperCase() !== correctCode)
      return { success: false, message: 'invalid code' };

    await userData.update({ accountStatus: 'accepted' });

    return { success: true, message: 'account accepted' };
  } catch {
    return null;
  }
};
