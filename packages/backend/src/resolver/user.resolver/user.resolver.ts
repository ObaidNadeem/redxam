import { JWT } from '@/config/jwt';
import { Contribution, TotalPrice, User } from '@/database';
import { Request } from 'express';

const getUserById = (userId: string) => {
  return User.findById(userId).lean().exec();
};

const getTotalContributions = async (): Promise<number> => {
  const [result] = await User.aggregate()
    .group({
      _id: null,
      totalContributions: {
        $sum: '$contribution',
      },
    })
    .exec();

  return result.totalContributions;
};

const getTotalPrice = async () => {
  const totalPrice = await TotalPrice.findOne({}, { _id: 0, price: 1 }).lean().exec();

  return parseFloat(totalPrice?.price) || 0;
};

const getUserContribution = (userId: string) => {
  return Contribution.findOne({ user_id: userId }).lean().exec();
};

const getData = async (userId: string) => {
  const userData = getUserById(userId);
  const userContributions = getUserContribution(userId);
  const totalPrice = getTotalPrice();
  const totalContributions = getTotalContributions();
  return Promise.all([userData, userContributions, totalPrice, totalContributions]);
};

/**
 * @Choooks22 user query doesn't have params, use authorization header in client instead
 */
export const user = async (_: void, req: Request) => {
  console.debug('[Resolve] user called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  try {
    const data = await getData(payload.userId);

    const [userData, userContributions, totalPrice, totalContributions] = data;

    return [
      {
        ...userData,
        contributions: userContributions,
        totalPrice,
        totalContributions,
      },
    ];
  } catch {
    return null;
  }
};
