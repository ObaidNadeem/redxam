import { checkRole } from './checkRole.resolver';
import { createUser } from './createUser.resolver';
import { updateToken } from './updateToken.resolver';
import { user } from './user.resolver';
import { users } from './users.resolver';
import { verifyToken } from './verifyToken.resolver';
import { balanceRecords } from './balanceRecords.resolver';
import { changeAccountStatus } from './changeAccountStatus.resolver';
import { waitlistLevel } from './waitlist.resolver';
import { mxWidgetConnect } from './mxWidgetConnect.resolver';

export const UserResolver = {
  checkRole,
  createUser,
  updateToken,
  user,
  users,
  verifyToken,
  balanceRecords,
  changeAccountStatus,
  waitlistLevel,
  mxWidgetConnect,
};
