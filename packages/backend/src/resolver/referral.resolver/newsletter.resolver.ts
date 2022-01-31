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
import { Argument, LoginInput, NewUser } from '../types';
const { SERVICE_EMAIL } = process.env;

const templatePath = resolve(__dirname, '../../emails/newsletter.hjs');
const templateData = readFileSync(templatePath, 'utf-8');

const topAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'top.png',
  content: readFileSync(`${__dirname}/../../emails/top.png`).toString('base64'),
  content_id: 'top@background',
  disposition: 'inline',
});

const logoAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'logo.png',
  content: readFileSync(`${__dirname}/../../emails/logo.png`).toString('base64'),
  content_id: 'logo@top',
  disposition: 'inline',
});

const elipseAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'elipse.png',
  content: readFileSync(`${__dirname}/../../emails/elipse.png`).toString('base64'),
  content_id: 'elipse@top',
  disposition: 'inline',
});

const greenAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'green.png',
  content: readFileSync(`${__dirname}/../../emails/green.png`).toString('base64'),
  content_id: 'green@top',
  disposition: 'inline',
});

const redAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'red.png',
  content: readFileSync(`${__dirname}/../../emails/red.png`).toString('base64'),
  content_id: 'red@top',
  disposition: 'inline',
});

const elipseListAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'elipse-list.png',
  content: readFileSync(`${__dirname}/../../emails/elipse-list.png`).toString('base64'),
  content_id: 'elipse-list@top',
  disposition: 'inline',
});

const facebookAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'facebook.png',
  content: readFileSync(`${__dirname}/../../emails/facebook.png`).toString('base64'),
  content_id: 'facebook@top',
  disposition: 'inline',
});

const twitterAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'twitter.png',
  content: readFileSync(`${__dirname}/../../emails/twitter.png`).toString('base64'),
  content_id: 'Twitter@top',
  disposition: 'inline',
});

const InstagramAttachment: Readonly<Attachment> = Object.freeze({
  filename: 'instagram.png',
  content: readFileSync(`${__dirname}/../../emails/instagram.png`).toString('base64'),
  content_id: 'Instagram@top',
  disposition: 'inline',
});

const sendMail = async (email: string, origin: string) => {
  const renderedTemplate = render(templateData, { frontEndURL: origin });

  await sendGrid.sendMail({
    from: `redxam.com <${SERVICE_EMAIL}>`,
    to: email,
    subject: 'Welcome to redxam.com!',
    html: renderedTemplate,
    attachments: [
      topAttachment,
      logoAttachment,
      elipseAttachment,
      greenAttachment,
      redAttachment,
      elipseListAttachment,
      facebookAttachment,
      twitterAttachment,
      InstagramAttachment,
    ],
  });
};

export const newsLetterDemo = async ({ arg }: Argument<LoginInput>, req: Request) => {
  console.debug('[Resolver] createUser called');
  sendMail(arg.email, req.headers.origin);
  try {
    return messages.success.general;
  } catch {
    return messages.failed.general;
  }
};
