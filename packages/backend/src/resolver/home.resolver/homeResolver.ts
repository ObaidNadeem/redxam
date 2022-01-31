import { JWT } from '@/config/jwt';
import { Vault, User, Deposits } from '@/database';
import { Request } from 'express';

// DEPOSITS
const getUserDeposits = async (userId: string) => {
  return Deposits.find({ userId });
};

const userDeposits = async (userId: string) => {
  const deposits = await getUserDeposits(userId);
  return deposits;
};

// VAULTS
const getVaults = async () => {
  const vaultsData = await Vault.find().limit(1).sort({ created_at: -1 }).lean().exec();
  const values = [];
  for await (const value of vaultsData) {
    values.push(value);
  }
  return { ...values[0] };
};

// BALANCE RECORDS
const get24hRecordBalance = async userId => {
  const timestap24h = Date.now() - 24 * 3600 * 1000;
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );
  if (drawRecords.length < 1) return 0;
  const record = drawRecords.reduce((a, b) => {
    return Math.abs(b.timestamp - timestap24h) < Math.abs(a.timestamp - timestap24h)
      ? b
      : a;
  });
  return record.balance;
};

const getDayRecords = async userId => {
  const startOfDay = new Date().setUTCHours(0, 0, 0, 0);
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords.filter(
    record => record.timestamp >= startOfDay && record.timestamp <= Date.now(),
  );
};

// USER
const getUserContribution = async userId => {
  const user = await User.findOne({ _id: userId }, { contribution: 1 });
  return user.contribution;
};

const dataHandler = async userId => {
  const deposits = await userDeposits(userId);
  const vaultsData = await getVaults();
  const lastDayBalance = await get24hRecordBalance(userId);
  const dayRecords = await getDayRecords(userId);
  const userContribution = await getUserContribution(userId);

  const userBalance = calcBalance(userContribution, vaultsData);

  const increasePercent = getPercentageChange(lastDayBalance, userBalance);
  return {
    deposits,
    balance: userBalance,
    ...increasePercent,
  };
};

export const home = async (_: void, req: Request) => {
  console.debug('[Resolve] home called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  try {
    const data = await dataHandler(payload.userId);
    return data;
  } catch {
    return null;
  }
};

// HELPERS
const calcBalance = (contribution, vaultData) => {
  const { vaults, totalContribution } = vaultData;
  let totalBalance = 0;
  Object.keys(vaults).forEach(key => {
    totalBalance += vaults[key].balance;
  });
  return (totalBalance * contribution) / totalContribution;
};

const getPercentageChange = (lastDayBalance, currentBalance) => {
  let increase = currentBalance - lastDayBalance;
  let percentChange = 0;
  if (lastDayBalance > 0) {
    percentChange = (increase / lastDayBalance) * 100;
  } else if (currentBalance > 0) {
    percentChange = 100;
  }  else { 
    percentChange = 0;
  }
  const dolarChange = currentBalance - lastDayBalance;
  return { percentChange, dolarChange };
};
