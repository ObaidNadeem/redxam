import { authorize } from '@/config/authorization';
import { messages } from '@/config/messages';
import { Referrer, ReferrerProps } from '@/database';
import sendGrid from '@/apis/sendgrid/index';
import { Request } from 'express';
import { SendMailOptions } from 'nodemailer';
import { Argument, SendReferInput } from '../types';

const { SERVICE_EMAIL } = process.env;

const getReferralLink = (referralId: string, origin: string) =>
  `${origin}/register?referral_id=${referralId}`;

const getMailOptions = (receiverEmail: string, referralLink: string): SendMailOptions => ({
  from: `redxam.com ${SERVICE_EMAIL}`,
  to: receiverEmail,
  subject: 'Referral Email',
  html: `To referrer, please click <a href="${referralLink}">here</a>.<br>Thank you!`,
});

const updateReferrer = async (referrer: ReferrerProps, userId: string, email: string) => {
  const referrerCount = referrer.referrers.split(',').length;
  if (referrerCount >= 10) {
    return messages.failed.referral.limitURL;
  }

  referrer.statuses += ',0';
  referrer.referrers += ',' + email;
  await referrer.save();
};

const createReferrer = async (userId: string, email: string) => {
  await Referrer.create({
    origin_id: userId,
    statuses: '0',
    referrers: email,
  });
};

export const sendReferral = authorize<Argument<SendReferInput>>(
  async ({ arg, payload }, req: Request) => {
    console.info('[Resolver] sendReferral called');
    if (payload.type !== 'verified') {
      return messages.failed.invalidToken;
    }

    const referralUrl = getReferralLink(payload.userId, req.headers.origin);
    const mailOptions = getMailOptions(arg.email, referralUrl);

    try {
      await sendGrid.sendMail(mailOptions);

      const referrer = await Referrer.findOne({ origin_id: payload.userId }).exec();

      const job = referrer
        ? updateReferrer(referrer, payload.userId, arg.email)
        : createReferrer(payload.userId, arg.email);

      await job;
      return messages.success.general;
    } catch (error) {
      console.error(error.message);
      return messages.failed.general;
    }
  },
);
