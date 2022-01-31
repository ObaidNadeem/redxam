import { Contribution } from '@/database';
import { Argument } from '../types';

/**
 * @todo getContribution missing from graphql schema?
 */
export const getContribution = async ({ arg }: Argument<{ userId: string }>) => {
  console.debug('[Resolver] getContributions called');
  if (!arg.userId) {
    return null;
  }

  return Contribution
    .findOne({ user_id: arg.userId })
    .lean()
    .exec()
    .catch((error: Error) => {
      console.error(error.message);
      return null;
    });
};
