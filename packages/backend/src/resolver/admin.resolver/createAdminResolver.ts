import { sign, verify } from 'jsonwebtoken';
import { Admin } from '@/database';
import { Request } from 'express';

const key = process.env.TOKEN_SECURITY_KEY;

interface adminToken {
  adminId: string;
}

export const createAdmin = async ({ arg }, req: Request) => {
  const { email } = arg;
  console.debug('[Resolve] createAdmin called');
  const token = getAuthorizationToken(req.headers.authorization);

  if (!token) throw new Error('invalid token');

  const payload = verify(token, key) as adminToken;

  try {
    const admin = await Admin.findOne({ _id: payload.adminId });
    if (!admin) throw new Error('user is not admin');
    if (!email) throw new Error('empty email');
    const adminExist = await Admin.findOne({ email });
    if (adminExist) throw new Error('admin already exist');

    const currentAdmin = await Admin.create({ ...arg });

    const adminToken = sign({ adminId: currentAdmin._id }, key);

    await Admin.updateOne({ _id: currentAdmin._id }, { $set: { token: adminToken } });
    return {
      success: true,
      message: 'admin created',
    };
  } catch (error) {
    return { success: false, message: error.message };
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
