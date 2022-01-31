import { JWT } from '@/config/jwt';
import { messages } from '@/config/messages';
import { ManualUser } from '@/database';
import { Argument } from '../types';

const updateUserVerification = async (userId: string, token: string) => {
  await ManualUser
    .updateOne(
      { _id: userId },
      { $set: { token, verification: true } },
    )
    .exec();
};

interface Input {
  token: string;
}

/**
 * @todo verifyManualToken missing from graphql schema?
 */
export const verifyManualToken = async ({ arg }: Argument<Input>) => {
  console.debug('[Resolver] verifyManualToken called');

  if (!arg.token) {
    return messages.failed.invalidToken;
  }

  try {
    const payload = new JWT(arg.token).verifySync();
    if (payload.type !== 'login') {
      throw null;
    }

    const token = new JWT({ userId: payload.userId, type: 'verified' }).signSync();
    await updateUserVerification(payload.userId, token);

    return {
      ...messages.success.login,
      token,
    };
  } catch {
    return messages.failed.invalidToken;
  }
};
