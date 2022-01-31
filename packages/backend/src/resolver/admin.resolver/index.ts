import { adminLogin } from './adminLogin.resolver';
import { admin } from './admin.resolver';
import { createAdmin } from './createAdminResolver';
import { overview } from './overview.resolver';

export const AdminResolver = {
  adminLogin,
  admin,
  createAdmin,
  overview,
};
