import { createWaitlist } from './createWaitlist.resolver';
import { getWaitList } from './getWaitList.resolver';
import { goUpQueue } from './goUpQueue.resolver';
import { sendReferral } from './sendReferral.resolver';

export const ReferralResolver = {
  createWaitlist,
  getWaitList,
  goUpQueue,
  sendReferral,
};
