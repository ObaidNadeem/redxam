import { JWT } from '@/config/jwt';
import { Request } from 'express';
import { Argument } from '../types';

interface Input {
  token: string;
}

/**
 * @todo checkRole missing from graphql schema?
 */
export const checkRole = async ({ arg }: Argument<Input>, req: Request) => {
  console.debug('[Resolver] checkRole called');

  /** @Choooks22 token should be in authorization header. should use this instead */
  // const payload = await new JWT().authorize(req.headers.authorization);

  const payload = await new JWT(arg.token).verify();
  return payload && payload.type === 'verified'
    ? { success: true, message: 'SUCCESS' }
    : null;
};
