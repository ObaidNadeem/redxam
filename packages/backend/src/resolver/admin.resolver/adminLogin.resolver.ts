import { Request } from 'express';
import { Admin } from '@/database';
const key = process.env.TOKEN_SECURITY_KEY;
/**
 * @todo adminLogin missing from graphql schema?
 */
export const adminLogin = async (args, req: Request) => {
  console.debug('[Resolver] adminLogin called');

  const { email, password } = req.body;
  const { token } = await Admin.findOne({ email, password }, { token: 1 });
  if (!token) return { error: 'bad log', exist: false };
  return { token };
};
