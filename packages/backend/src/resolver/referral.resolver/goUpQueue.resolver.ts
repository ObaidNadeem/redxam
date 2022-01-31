import { authorize } from '@/config/authorization';
import { messages } from '@/config/messages';
import { User } from '@/database';

const getCurrentUserLevel = async (userId: string) => {
  const user = await User
    .findOne(
      { _id: userId },
      { level: 1 },
    )
    .lean()
    .exec();

  return user.level;
};

const moveOneLevelDownUp = async (level: number) => {
  await User
    .updateOne(
      { level: level - 1 },
      { $set: { level } },
    )
    .exec();
};

const moveCurrentOneLevelDown = async (userId: string) => {
  await User
    .updateOne(
      { _id: userId },
      { $inc: { level: -1 } },
    )
    .exec();
};

export const goUpQueue = authorize(async ({ payload }) => {
  console.debug('[Resolver] goUpQueue called');
  if (payload.type !== 'verified') {
    return messages.failed.invalidToken;
  }

  const userLevel = await getCurrentUserLevel(payload.userId);
  if (userLevel === 1) {
    return {
      ...messages.failed.general,
      level: 1,
    };
  }

  try {
    const job1 = moveOneLevelDownUp(userLevel);
    const job2 = moveCurrentOneLevelDown(payload.userId);
    await Promise.all([job1, job2]);

    return {
      ...messages.success.general,
      level: userLevel - 1,
    };

  } catch {
    return messages.failed.general;
  }
});
