import { JWT } from '@/config/jwt';
import { Request } from 'express';
import { User } from '@/database';

export const balanceRecords = async (args, req: Request) => {
  console.debug('[Resolve] balance record called');

  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  if (!req.body.view) return null;

  const { view } = req.body;

  try {
    switch (view) {
      case 'DAY':
        return getDayRecords(payload.userId);
      case 'MONTH':
        return getMonthRecords(payload.userId);
      case 'MONTH3':
        return getMonth3Records(payload.userId);
      case 'MONTH6':
        return getMonth6Records(payload.userId);
      case 'YEAR':
        return getYearRecords(payload.userId);
      case 'ALL':
        return getAllRecords(payload.userId);
      case '24H':
        const record = await get24hRecord(payload.userId);
        if (record) return [record];
        return [];
      default:
        break;
    }
  } catch {
    return null;
  }
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

const getMonthRecords = async userId => {
  let today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).setUTCHours(
    0,
    0,
    0,
    0,
  );
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).setUTCHours(
    23,
    59,
    59,
    999,
  );
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords.filter(
    record => record.timestamp >= startOfMonth && record.timestamp <= endOfMonth,
  );
};

const getMonth3Records = async userId => {
  let today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).setUTCHours(
    0,
    0,
    0,
    0,
  );
  const endOfMonth3 = new Date(today.getFullYear(), today.getMonth() + 3, 0).setUTCHours(
    23,
    59,
    59,
    999,
  );
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords.filter(
    record => record.timestamp >= startOfMonth && record.timestamp <= endOfMonth3,
  );
};

const getMonth6Records = async userId => {
  let today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).setUTCHours(
    0,
    0,
    0,
    0,
  );
  const endOfMonth6 = new Date(today.getFullYear(), today.getMonth() + 6, 0).setUTCHours(
    23,
    59,
    59,
    999,
  );
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords.filter(
    record => record.timestamp >= startOfMonth && record.timestamp <= endOfMonth6,
  );
};

const getYearRecords = async userId => {
  let today = new Date();
  const startOfYear = new Date(today.getFullYear(), today.getMonth(), 1).setUTCHours(
    0,
    0,
    0,
    0,
  );
  const endOfYear = new Date(today.getFullYear() + 1, today.getMonth(), 0).setUTCHours(
    23,
    59,
    59,
    999,
  );
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords.filter(
    record => record.timestamp >= startOfYear && record.timestamp <= endOfYear,
  );
};

const getAllRecords = async userId => {
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );

  return drawRecords;
};

const get24hRecord = async userId => {
  const timestap24h = Date.now() - 24 * 3600 * 1000;
  const [{ balanceRecords: drawRecords }] = await User.find(
    {
      _id: userId,
    },
    {
      balanceRecords: 1,
    },
  );
  if (drawRecords.length < 1) return null;
  return drawRecords.reduce((a, b) => {
    return Math.abs(b.timestamp - timestap24h) < Math.abs(a.timestamp - timestap24h)
      ? b
      : a;
  });
};
