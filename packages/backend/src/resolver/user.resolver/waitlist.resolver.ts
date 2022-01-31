import { Request } from 'express';
import { User } from '@/database';

export const waitlistLevel = async ({ waitlistToken }, req: Request) => {
  console.debug('[Resolver] waitlistLevel level called');
  const referrer = await User.findOne({
    waitlistToken
  }, {
    referralCode: 1, level: 1
  });
  if (!referrer) {
    return {
      success: false, message: 'invalid waitlist token'
    };
  }
  return {
    success: true,
    referralCode: referrer.referralCode,
    level: referrer.level
  };
};
