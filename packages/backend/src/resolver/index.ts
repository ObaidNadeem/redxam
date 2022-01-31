import { CardResolver } from './card.resolver';
import { ContributionResolver } from './contribution.resolver';
import { ManualUserResolver } from './manualUser.resolver';
import { ReferralResolver } from './referral.resolver';
import { UserResolver } from './user.resolver';
import { depositsResolver } from './deposits.resolver';
import { vaultsResolver } from './vault.resolver';
import { AdminResolver } from './admin.resolver';
import { changeRequestResolver } from './changeRequest.resolver';
import { HomeResolver } from './home.resolver';
import { featureCheckResolver } from './featureCheck.resolver';
import { twilioResolver } from './twilio.resolver';

export const resolver = {
  ...CardResolver,
  ...ContributionResolver,
  ...ManualUserResolver,
  ...ReferralResolver,
  ...UserResolver,
  ...depositsResolver,
  ...vaultsResolver,
  ...AdminResolver,
  ...changeRequestResolver,
  ...HomeResolver,
  ...featureCheckResolver,
  ...twilioResolver,
};
