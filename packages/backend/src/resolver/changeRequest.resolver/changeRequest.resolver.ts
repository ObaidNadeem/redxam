import { JWT } from '@/config/jwt';
import { ChangeRequest } from '@/database';
import { Request } from 'express';

export const changeRequest = async ({ arg }, req: Request) => {
  console.debug('[Resolve] change potfolio request called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  if (!arg) return null;

  const requiredPortfolio = arg;

  try {
    const [userRequest] = await ChangeRequest.find({ userId: payload.userId })
      .limit(1)
      .sort({ created_at: -1 });

    if (userRequest && userRequest.emailSent) {
      await ChangeRequest.create({
        userId: payload.userId,
        timestamp: Date.now(),
        requiredPortfolio,
      });
    } else {
      await ChangeRequest.updateOne(
        { userId: payload.userId },
        {
          $set: {
            timestamp: Date.now(),
            requiredPortfolio,
            emailSent: false,
            processed: false,
          },
        },
        { upsert: true },
      );
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
};
