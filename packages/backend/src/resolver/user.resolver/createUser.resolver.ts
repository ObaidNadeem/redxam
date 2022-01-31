import { messages } from '@/config/messages';
import { User } from '@/database';
import { SimpleWallet } from '@/database/types';
import sendGrid from '@/apis/sendgrid/index';
import { generateWallet } from '@/service/wallets';
import { Request } from 'express';
import { readFileSync } from 'fs';
import { render } from 'mustache';
import { Attachment } from 'nodemailer/lib/mailer';
import { resolve } from 'path';
import { admin } from '../admin.resolver/admin.resolver';
import { Argument, NewUser } from '../types';
import crypto from 'crypto';

const { SERVICE_EMAIL } = process.env;

const templatePath = resolve(__dirname, '../../emails/simplewaitlist.hjs');
const templateData = readFileSync(templatePath, 'utf-8');

const facebookIcon: Readonly<Attachment> = Object.freeze({
  filename: 'facebook.png',
  content: readFileSync(`${__dirname}/../../emails/facebook.png`).toString('base64'),
  content_id: 'facebook@waitlist',
  disposition: 'inline',
});

const twitterIcon: Readonly<Attachment> = Object.freeze({
  filename: 'twitter.png',
  content: readFileSync(`${__dirname}/../../emails/twitter.png`).toString('base64'),
  content_id: 'twitter@waitlist',
  disposition: 'inline',
});

const linkedInIcon: Readonly<Attachment> = Object.freeze({
  filename: 'linkedin.png',
  content: readFileSync(`${__dirname}/../../emails/linkedin.png`).toString('base64'),
  content_id: 'linkedin@waitlist',
  disposition: 'inline',
});

const telegramIcon: Readonly<Attachment> = Object.freeze({
  filename: 'telegram.png',
  content: readFileSync(`${__dirname}/../../emails/telegram.png`).toString('base64'),
  content_id: 'telegram@waitlist',
  disposition: 'inline',
});

const discordIcon: Readonly<Attachment> = Object.freeze({
  filename: 'discord.png',
  content: readFileSync(`${__dirname}/../../emails/discord.png`).toString('base64'),
  content_id: 'discord@waitlist',
  disposition: 'inline',
});

const checkUserExists = async (user: NewUser) => {
  const { email, phone } = user;
  let query = [];

  if (email) query.push({ email });
  if (phone) query.push({ phone });

  return User.exists({ $or: query });
};

const getLastOrder = async () => {
  const user = await User.findOne({}, { _id: 0, level: 1 })
    .sort({ level: -1 })
    .lean()
    .exec();

  return user?.level ?? 0;
};

const sendMail = async (
  email: string,
  lastOrder: number,
  origin,
  waitlistToken: string,
  referralCode: string,
) => {
  const renderedTemplate = render(templateData, {
    lastOrder,
    origin,
    waitlistToken,
    referralCode,
    randomText: `Ref #: ${Date.now()}`,
  });

  await sendGrid.sendMail({
    from: `redxam.com <${SERVICE_EMAIL}>`,
    to: email,
    subject: 'You Join The Waitlist | redxam',
    html: renderedTemplate,
    attachments: [facebookIcon, twitterIcon, linkedInIcon, telegramIcon, discordIcon],
  });
};

const createNewUser = async (
  user: NewUser,
  wallet: SimpleWallet,
  level: number,
  waitlistToken: string,
  referralCode: string,
) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    birthPlace,
    title,
    address,
    nearestLandmark,
    state,
    marriedStatus,
    occupation,
    identityIDType,
    identityIDNumber,
    issuance,
    issuancePlace,
    issuanceDate,
    issuanceStatus,
    expiringDate,
  } = user;
  await User.create({
    firstName,
    lastName,
    pending_balance: 0,
    accountBalance: 0,
    balance: 0,
    email: email.toLowerCase(),
    phone,
    wallet,
    level,
    token: '',
    deposited: 0,
    withdrawn: 0,
    accountStatus: 'pending',
    birthPlace,
    title,
    address,
    nearestLandmark,
    state,
    marriedStatus,
    occupation,
    identityIDType,
    identityIDNumber,
    issuance,
    issuancePlace,
    issuanceDate,
    issuanceStatus,
    expiringDate,
    waitlistToken,
    referralCode,
  });
};

export const createUser = async ({ arg }: Argument<NewUser>, req: Request) => {
  console.debug('[Resolver] createUser called');

  const adminInfo = await admin(null, req);
  // @ts-expect-error
  if (adminInfo?.err) return adminInfo?.err;

  if (await checkUserExists(arg)) {
    return messages.failed.existed;
  }

  if (arg.referralCode) {
    console.log('handlethis');
  }

  try {
    const wallet = generateWallet();
    const waitlistToken = crypto.randomBytes(8).toString('hex');
    const referralCode = crypto.randomBytes(4).toString('hex');
    const lastOrder = await getLastOrder();

    const jobSend = sendMail(
      arg.email,
      lastOrder,
      req.headers.origin,
      waitlistToken,
      referralCode,
    );
    const jobCreate = createNewUser(
      arg,
      wallet,
      lastOrder + 1,
      waitlistToken,
      referralCode,
    );

    await Promise.all([jobSend, jobCreate]);
    return messages.success.register;
  } catch (err) {
    console.log(err);
    return messages.failed.general;
  }
};
