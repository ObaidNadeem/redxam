import { JWT } from '@/config/jwt';
import { messages } from '@/config/messages';
import { verify } from '@/config/twlio';
import { ManualUser, ManualUserProps } from '@/database';
import sendGrid from '@/apis/sendgrid/index';
import { Request } from 'express';
import { Argument } from '../types';

interface Input {
  email: string;
  phone: string;
}

const { GMAIL_USER_EMAIL } = process.env;

const getLoginUrl = (loginToken: string, origin: string) =>
  origin + `/verify?token=${loginToken}`;

const updateUserToken = async (userId: string, token: string) => {
  await ManualUser.updateOne({ _id: userId }, { $set: { token } }).exec();
};

const fetchUserByEmail = async (
  email: string,
): Promise<Pick<ManualUserProps, '_id' | 'email'>> => {
  return ManualUser.findOne({ email }, { email: 1 }).lean().exec();
};

const fetchUserByPhone = async (
  phone: string,
): Promise<Pick<ManualUserProps, '_id' | 'phone'>> => {
  return ManualUser.findOne({ phone }, { phone: 1 }).lean().exec();
};

const loginByEmail = async (email: string, origin: string) => {
  const user = await fetchUserByEmail(email);

  if (!user) {
    console.warn('[Resolver] updateManualToken no user');
    return messages.failed.general;
  }

  const token = new JWT({ userId: user._id, type: 'login' }).signSync();
  await sendGrid.sendMail({
    from: GMAIL_USER_EMAIL,
    to: user.email,
    subject: 'Login Email',
    html: `To log in, please click <a href = "${getLoginUrl(
      token,
      origin,
    )}">here</a>.<br>Thank you!`,
  });

  await updateUserToken(user._id, token);
  return messages.success.loginByEmail;
};

const loginByPhone = async (phone: string) => {
  const user = await fetchUserByPhone(phone);

  if (!user) {
    console.warn('[Resolver] updateManualToken no user');
    return messages.failed.general;
  }

  const verification = await verify(phone);
  console.debug(verification);

  /** @Choooks22 we remove user token? */
  await updateUserToken(user._id, '');
  return messages.success.loginByPhone;
};

/**
 * @todo updateManualToken missing from graphql schema?
 */
export const updateManualToken = async ({ arg }: Argument<Input>, req: Request) => {
  console.debug('[Resolver] updateManualToken called');
  try {
    const job = arg.email
      ? loginByEmail(arg.email, req.headers.origin)
      : loginByPhone(arg.phone);

    return await job;
  } catch (error) {
    console.error(error.message);
    return messages.failed.general;
  }
};
