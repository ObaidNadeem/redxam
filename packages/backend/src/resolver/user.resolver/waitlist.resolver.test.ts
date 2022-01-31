import { waitlistLevel } from './waitlist.resolver';
import { User } from '@/database';

describe('Test waitlistLevel endpoint', () => {
  test('invalid token', async () => {
    const res = await waitlistLevel({ waitlistToken: 'wrongtoken' }, null);
    expect(res.message).toMatch('invalid waitlist token');
  });
  test('Successfull call', async () => {
    const { waitlistToken, referralCode, level } = await User.findOne(
      {},
      { waitlistToken: 1, referralCode: 1, level: 1 },
    );

    const res = await waitlistLevel({ waitlistToken }, null);
    expect(res.success).toBeTruthy();
    expect(res.level).toEqual(level);
    expect(res.referralCode).toMatch(referralCode);
  });
});
