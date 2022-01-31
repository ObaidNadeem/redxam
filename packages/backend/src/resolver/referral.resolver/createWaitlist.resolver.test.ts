import { createWaitlist } from './createWaitlist.resolver';
import { User } from '@/database';
import { Request } from 'jest-express/lib/request';

describe('Test waitlist user creation', () => {
  test('wrong referral code', async () => {
    const res = await createWaitlist({
      arg: {
        email: 'test@redxam-testing.com',
        referralCode: 'wrongreferralcode'
      }
    },
      null);
    expect(res.message).toMatch('referral code does not exist');
  });

  test('create new waitlist user', async () => {
    const req: any = new Request();
    req.headers.origin = '';
    const res = await createWaitlist({
      arg: {
        email: 'test@redxam-testing.com'
      }
    },
      req);

    const createdUser = await User.findOne({
      email: 'test@redxam-testing.com'
    });

    expect(res.success).toBeTruthy();
    expect(createdUser).not.toBeUndefined();

    if (createdUser) {
      await createdUser.delete();
    }
  });
});
