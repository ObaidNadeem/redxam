import { Contribution, TotalPrice, User } from '@/database';

interface UserData {
  _id: string;
  contribution: number;
  last_contribution?: {
    _id: string;
  };
}

const createLogger = (userId: string) => {
  const logger = (ok: 0 | 1, message: string) => {
    console.log(message);
    console.log(`ok: ${ok}, userId: ${userId}`);
  };
  return {
    reportSuccess(method: 'create' | 'update') {
      logger(1, `new contribution ${method}d!`);
    },
    reportError(error: Error) {
      logger(0, `Error: ${error.message}!`);
    },
  };
};

const getAllUsers = async (): Promise<UserData[]> => {
  return User.aggregate()
    .lookup({
      from: Contribution.collection.name,
      let: { user_id: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$user_id', '$$user_id'],
            },
          },
        },
        { $sort: { created_at: -1 } },
        { $limit: 1 },
        { $project: { _id: 1 } },
      ],
      as: 'last_contribution',
    })
    .unwind({
      path: '$last_contribution',
      preserveNullAndEmptyArrays: true,
    })
    .project({
      _id: 1,
      contribution: 1,
      last_contribution: 1,
    });
};

const getTotalPrice = async () => {
  const totalPrice = await TotalPrice.findOne({}, { price: 0 }).lean().exec();

  return parseFloat(totalPrice?.price) || 0;
};

const getData = async () => {
  const users = getAllUsers();
  const totalPrice = getTotalPrice();
  return Promise.all([users, totalPrice]);
};
/**
 * Update the contribution
*/
const createContributionGenerator = (totalPrice: number, totalContributions: number) => {
  return async (user: UserData) => {
    const { reportSuccess, reportError } = createLogger(user._id);
    const contributions =
      // eslint-disable-next-line @typescript-eslint/no-extra-parens
      totalContributions && (user.contribution * totalPrice) / totalContributions;
    console.log(contributions);
    try {
      let method: 'create' | 'update';
      if (user.last_contribution) {
        method = 'update';
        await Contribution.updateOne(
          { _id: user.last_contribution._id },
          { $push: { contributions } },
        );
      } else {
        method = 'create';
        await Contribution.create({
          user_id: user._id,
          contributions: [contributions],
        });
      }
      reportSuccess(method);
    } catch (error) {
      reportError(error);
    }
  };
};

export const updateAllContributions = async () => {
  const [users, totalPrice] = await getData();

  const totalContributions = users.reduce((total, user) => {
    return total + Number(user.contribution);
  }, 0);
  const createNewContribution = createContributionGenerator(totalPrice, totalContributions);
  const updates = users.map(createNewContribution);
  await Promise.all(updates);
};
