import { JWT } from '@/config/jwt';
import { messages } from '@/config/messages';
import { verificationCheck } from '@/config/twlio';
import { User, UserProps } from '@/database';
import { Argument, VerifyInput } from '../types';

const getUserByPhone = async (phone: string): Promise<Pick<UserProps, '_id'>> => {
  return User.findOne({ phone }, { _id: 1 }).lean().exec();
};

const updateUserToken = async (userId: string, token: string) => {
  await User.updateOne({ _id: userId }, { $set: { token, verification: true } }).exec();
};

const verifyByToken = async (tokenArg: string) => {
  const payload = await new JWT(tokenArg).verify();
  if (payload.type !== 'login') {
    return messages.failed.invalidToken;
  }

  const token = await new JWT({ userId: payload.userId, type: 'verified' }).sign();
  await updateUserToken(payload.userId, token);
  console.log(token);
  return {
    ...messages.success.login,
    token,
  };
};

const verifyByPhone = async (phone: string, code: string) => {
  const user = await getUserByPhone(phone);

  if (!user) {
    console.warn('[Resolver] verifyToken no user');
    return messages.failed.general;
  }

  const verification = await verificationCheck(phone, code);
  if (verification.status !== 'approved') {
    return messages.failed.general;
  }

  const token = await new JWT({ userId: user._id, type: 'verified' }).sign();
  await updateUserToken(user._id, token);

  return {
    ...messages.success.verify,
    token,
  };
};

export const verifyToken = async ({ arg }: Argument<VerifyInput>) => {
  console.debug('[Resolver] verifyToken called');
  // if (!arg.token || !arg.code && !arg.phone) {
  //   return messages.failed.invalidToken;
  // }
  try {
    const job = arg.token ? verifyByToken(arg.token) : verifyByPhone(arg.phone, arg.code);

    return await job;
  } catch {
    return messages.failed.general;
  }
};
