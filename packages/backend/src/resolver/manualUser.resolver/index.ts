import { createManualUser } from './createManualUser.resolver';
import { manualUser } from './manualUser.resolver';
import { manualUsers } from './manualUsers.resolver';
import { updateManualToken } from './updateManualToken.resolver';
import { verifyManualToken } from './verifyManualToken.resolver';

export const ManualUserResolver = {
  createManualUser,
  manualUser,
  manualUsers,
  updateManualToken,
  verifyManualToken,
};
