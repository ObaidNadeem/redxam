import { JWT } from '@/config/jwt';
import { ManualUser } from '@/database';
import { Request } from 'express';

/**
 * @todo manualUser missing from graphql schema?
 */
export const manualUser = async (_: void, req: Request) => {
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  return ManualUser
    .findOne({ _id: payload.userId })
    .catch((error: Error) => {
      console.error(error.message);
      return null;
    });
};
