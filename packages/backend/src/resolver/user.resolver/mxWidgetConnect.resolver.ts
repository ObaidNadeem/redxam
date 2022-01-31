import { JWT } from '@/config/jwt';
import { User } from '@/database';
import { Request } from 'express';
import { getWidgetUrl, createUser } from '@/apis/mx';

/**
 * @Choooks22 query doesn't have params, use authorization header in client instead
 */
export const mxWidgetConnect = async (_: void, req: Request) => {
  console.debug('[Resolve] user called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return { success: false, message: 'invalid auth token' };
  }

  try {
    const userMxId = await getMxId(payload.userId);
    const widgetUrl = await getWidgetUrl(userMxId);

    return { widgetUrl };
  } catch (error) {
    throw new Error(error);
  }
};

const getMxId = async userId => {
  const user = await getUserById(userId);
  if (!user.mxId) {
    return await createMxUser(user);
  } else {
    return user.mxId;
  }
};

const getUserById = async userId => {
  return User.findOne({ _id: userId });
};

const createMxUser = async user => {
  const userRes = await createUser(user);
  await User.updateOne({ _id: user._id }, { $set: { mxId: userRes.guid } });
  return userRes.guid;
};
