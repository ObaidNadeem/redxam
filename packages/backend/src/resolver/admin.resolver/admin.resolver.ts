import { verify } from 'jsonwebtoken';
import { Admin } from '@/database';
import { Request } from 'express';

const key = process.env.TOKEN_SECURITY_KEY;

export interface adminToken {
  adminId: string;
}

export const admin = async (_: void, req: Request) => {
  console.debug('[Resolve] admin called');
  const token = getAuthorizationToken(req.headers.authorization);

  if (!token) throw new Error('invalid token');

  const payload = verify(token, key) as adminToken;

  try {
    const adminData = await Admin.findOne({ _id: payload.adminId });
    return adminData._id ? adminData : { err: 'admin not found' };
  } catch (err) {
    return { err };
  }
};

const getAuthorizationToken = (authorizationHeader: string) => {
  const authorization = authorizationHeader?.split(' ');
  if (!authorization) {
    console.debug('No authorization header!');
    return null;
  }

  const [tokenType, token] = authorization;
  if (tokenType !== 'Bearer') {
    console.debug('Invalid token type!');
    return null;
  }

  if (!token) {
    console.debug('No token passed!');
    return null;
  }

  return token;
};
