import { ManualUser } from '@/database';

/**
 * @todo manualUsers missing from graphql schema?
 */
export const manualUsers = async () => {
  return ManualUser
    .find()
    .lean()
    .exec();
};
