import { JWT } from '@/config/jwt';
import { Contribution, TotalPrice, User, Deposits } from '@/database';
import { Request } from 'express';
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const getUserPhone = async userId => {
  const user = await User.findOne({ _id: userId });
  return user.phone;
};

export const startTwilioVerify = async (_: void, req: Request) => {
  console.debug('[Resolve] startTwilioVerify called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }
  console.log(client);
  try {
    const phone = await getUserPhone(payload.userId);
    if (!phone) return { success: false, message: 'not user phone' };
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({ to: phone, channel: 'sms' });

    const status = verification.status;
    return {
      success: true,
      message: status,
    };
  } catch (error) {
    if (error.code === 60200) return { success: false, message: 'invalid phone' };
    return { success: false, message: error };
  }
};
export const checkTwilioVerify = async ({ arg }, req: Request) => {
  console.debug('[Resolve] checkTwilioVerify called');
  const { code } = arg;
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  try {
    const phone = await getUserPhone(payload.userId);
    const verificationCheck = await client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({ to: phone, code });
    return {
      success: verificationCheck.status === 'approved',
      message: verificationCheck.valid ? 'approved' : 'rejected',
    };
  } catch (error) {
    if (error.code === 20404) return { success: false, message: 'expired' };
    return { success: false, message: 'unknown error' };
  }
};
