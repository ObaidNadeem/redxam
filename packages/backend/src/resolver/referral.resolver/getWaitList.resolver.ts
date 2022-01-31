import { authorize } from '@/config/authorization';
import { messages } from '@/config/messages';
import { Referrer } from '@/database';

export const getWaitList = authorize(async ({ payload }) => {
  console.info('[Resolver] getWaitList called');
  if (payload.type !== 'verified') {
    return messages.failed.invalidToken;
  }

  return Referrer
    .findOne({ origin_id: payload.userId })
    .lean()
    .exec();
});
