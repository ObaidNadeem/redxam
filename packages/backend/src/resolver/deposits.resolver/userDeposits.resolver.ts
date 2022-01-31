// TODO: DELETE THIS FILE
import { JWT } from '@/config/jwt';
import { Deposits } from '@/database';
import { Request } from 'express';

const getUserDeposits = async (userId: string) => {
  return Deposits.find({ userId });
};

const getData = async (userId: string) => {
  const userDeposits = getUserDeposits(userId);
  return Promise.all([userDeposits]);
};

export const userDeposits = async (_: void, req: Request) => {
  console.debug('[Resolve] deposits called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  try {
    const data = await getData(payload.userId);

    const [userDepositsData] = data;
    console.log(Deposits);
    return [...userDepositsData];
  } catch {
    return null;
  }
};
