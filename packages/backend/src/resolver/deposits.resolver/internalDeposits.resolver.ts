import { InternalDeposits, Admin } from '@/database';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

const key = process.env.TOKEN_SECURITY_KEY;

interface adminToken {
  adminId: string;
}

export const internalDeposits = async (_: void, req: Request) => {
  console.debug('[Resolve] deposits called');
  const auth = await getAuthorizationToken(req.headers.authorization);
  if (!auth.isAuth) return auth.response;

  try {
    const internalDepositsData = await InternalDeposits.find({});
    return { internalDeposits: internalDepositsData, success: true };
  } catch (error) {
    return { success: false, message: error || 'something went wrong' };
  }
};

const getAuthorizationToken = async (authorizationHeader: string) => {
  const authorization = authorizationHeader?.split(' ');
  if (!authorization) {
    console.debug('No authorization header!');
    return {
      isAuth: false,
      response: { success: false, message: 'no authorization header' },
    };
  }

  const [tokenType, token] = authorization;
  if (tokenType !== 'Bearer') {
    console.debug('Invalid token type!');
    return { isAuth: false, response: { success: false, message: 'invalid token type' } };
  }

  if (!token) {
    console.debug('No token passed!');
    return { isAuth: false, response: { success: false, message: 'no token passed' } };
  }
  const payload = verify(token, key) as adminToken;
  const admin = await Admin.findOne({ _id: payload.adminId });
  if (!admin)
    return { isAuth: false, response: { success: false, message: 'not an admin' } };

  return { isAuth: true, admin };
};
