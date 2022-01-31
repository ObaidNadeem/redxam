import { JWT } from '@/config/jwt';
import express from 'express';
import { readFileSync } from 'fs';
import { render } from 'mustache';
import { Attachment } from 'nodemailer/lib/mailer';
import { resolve } from 'path';
import sendGrid from '@/apis/sendgrid';
import { plaidClient } from '@/apis/plaid';
import { stripeInstance } from '@/apis/stripe';
import { AccountSubtype, CountryCode, LinkTokenCreateRequest, Products } from 'plaid';
import { messages } from '@/config/messages';
import { Deposits, DepositsCurrencyType, DepositsType, User } from '@/database';
import Stripe from 'stripe';
import { bankAccount } from '@/database/schema/user.schema';

const { SERVICE_EMAIL } = process.env;

const templatePath = resolve(__dirname, '../emails/plaid.hjs');
const templateData = readFileSync(templatePath, 'utf-8');

const facebookIcon: Readonly<Attachment> = Object.freeze({
  filename: 'facebook.png',
  content: readFileSync(`${__dirname}/../emails/facebook.png`).toString('base64'),
  content_id: 'facebook@login',
  disposition: 'inline',
});

const twitterIcon: Readonly<Attachment> = Object.freeze({
  filename: 'twitter.png',
  content: readFileSync(`${__dirname}/../emails/twitter.png`).toString('base64'),
  content_id: 'twitter@login',
  disposition: 'inline',
});

const linkedInIcon: Readonly<Attachment> = Object.freeze({
  filename: 'linkedin.png',
  content: readFileSync(`${__dirname}/../emails/linkedin.png`).toString('base64'),
  content_id: 'linkedin@login',
  disposition: 'inline',
});

const telegramIcon: Readonly<Attachment> = Object.freeze({
  filename: 'telegram.png',
  content: readFileSync(`${__dirname}/../emails/telegram.png`).toString('base64'),
  content_id: 'telegram@login',
  disposition: 'inline',
});

const discordIcon: Readonly<Attachment> = Object.freeze({
  filename: 'discord.png',
  content: readFileSync(`${__dirname}/../emails/discord.png`).toString('base64'),
  content_id: 'discord@login',
  disposition: 'inline',
});

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.json(messages.failed.invalidToken);

    const payload = await new JWT().authorize(req.headers.authorization);

    if (!payload || payload.type !== 'verified') {
      return null;
    }

    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: 'payload.userId',
      },
      client_name: 'Redxam',
      products: [Products.Auth, Products.Transactions],
      country_codes: [
        CountryCode.Us,
        CountryCode.Ca,
        CountryCode.Gb,
        CountryCode.Ie,
        CountryCode.Fr,
        CountryCode.Es,
        CountryCode.Nl,
      ],
      language: 'en',
      account_filters: {
        depository: {
          account_subtypes: [AccountSubtype.Checking, AccountSubtype.Savings],
        },
      },
    };

    const response = await plaidClient.linkTokenCreate(request);

    res.json({ token: response.data.link_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
      },
    });
  }
});

/**
 *  Generates Plaid Token
 *  Countries: US, CA, GB, IE, FR, ES & NL
 *  ref: plaidClient
 */
router.post('/', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.json(messages.failed.invalidToken);

    const payload = await new JWT().authorize(req.headers.authorization);

    if (!payload || payload.type !== 'verified') {
      return null;
    }

    let { public_token, metadata } = req.body;

    const user = await User.findOne({ _id: payload.userId });

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const institutionInfo = await plaidClient.institutionsGetById({
      institution_id: metadata.institution.institution_id,
      country_codes: [
        CountryCode.Us,
        CountryCode.Ca,
        CountryCode.Gb,
        CountryCode.Ie,
        CountryCode.Fr,
        CountryCode.Es,
        CountryCode.Nl,
      ],
      options: {
        include_optional_metadata: true,
      },
    });

    user.bankAccounts.push({
      accessToken: response.data.access_token,
      accounts: metadata.accounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        logo: institutionInfo.data.institution.logo,
        type: acc.type,
      })),
    });

    await user.save();

    res.json({ success: 1 });
  } catch (error) {
    res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
      },
    });
  }
});

/**
 *  Returns Saved Bank Accounts
 *  based on user ID
 */
router.get('/accounts', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.json(messages.failed.invalidToken);

    const payload = await new JWT().authorize(req.headers.authorization);

    if (!payload || payload.type !== 'verified') {
      return null;
    }

    const user = await User.findOne({ _id: payload.userId });

    res.json({ accounts: user.bankAccounts.map(bankAcc => bankAcc.accounts).flat() });
  } catch (error) {
    res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
      },
    });
  }
});

/**
 * Unlinks bank accounts
 */
router.post('/accounts/unlink', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.json(messages.failed.invalidToken);

    const payload = await new JWT().authorize(req.headers.authorization);

    if (!payload || payload.type !== 'verified') {
      return null;
    }

    const user = await User.findOne({ _id: payload.userId });

    const { IDs } = req.body;

    if (!IDs || !IDs.length) return res.json(messages.failed.general);

    user.bankAccounts.forEach(bankAcc => {
      bankAcc.accounts
        .filter(acc => IDs.includes(acc.id))
        .forEach(async acc => {
          // @ts-ignore
          await bankAcc.accounts.pull({ _id: acc._id });
        });
    });

    user.bankAccounts.forEach(async bankAcc => {
      if (!bankAcc.accounts.length) {
        // @ts-ignore
        await user.bankAccounts.pull({ _id: bankAcc._id });
      }
    });

    await user.save();

    res.json({ success: 1 });
  } catch (error) {
    res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
      },
    });
  }
});

/**
 *  Stripe Deposit
 *  references plaidClient
 */
router.post('/deposit', async (req, res) => {
  try {
    if (!req.headers.authorization) return res.json(messages.failed.invalidToken);

    const payload = await new JWT().authorize(req.headers.authorization);

    if (!payload || payload.type !== 'verified') {
      return null;
    }

    let { account_id, amount } = req.body;

    const user = await User.findOne({ _id: payload.userId });

    let usedAccount;
    let accountInfo = user.bankAccounts.find(bankAcc =>
      bankAcc.accounts.find(acc => {
        if (acc.id === account_id) usedAccount = acc;
        return acc.id === account_id;
      }),
    );

    try {
      const stripeInfo = await plaidClient.processorStripeBankAccountTokenCreate({
        access_token: accountInfo.accessToken as string,
        account_id,
      });

      const charge = await stripeInstance.charges.create({
        amount: amount * 100,
        currency: 'usd',
        source: stripeInfo.data.stripe_bank_account_token,
        description: 'Redxam deposit',
        metadata: {
          user_id: payload.userId,
        },
      });

      await Deposits.create({
        userId: payload.userId,
        type: DepositsType.FIAT,
        currency: DepositsCurrencyType.USD,
        amount,
        timestamp: new Date().getTime(),
        status: 'pending',
        stripeChargeId: charge.id,
        bankName: usedAccount.name,
        bankIcon: usedAccount.logo,
        bankType: usedAccount.type,
      });

      await sendGrid.sendMail({
        from: `redxam.com <${SERVICE_EMAIL}>`,
        to: user.email,
        subject: ' Your deposit on it’s way 💸 | redxam',
        html: render(templateData, { amount }),
        attachments: [facebookIcon, twitterIcon, linkedInIcon, telegramIcon, discordIcon],
      });

      res.json({ success: 1 });
    } catch (error) {
      if (error?.response?.data?.error_code === 'ITEM_LOGIN_REQUIRED') {
        const linkTokenResponse = await plaidClient.linkTokenCreate({
          user: { client_user_id: payload.userId },
          client_name: 'Redxam',
          country_codes: [
            CountryCode.Us,
            CountryCode.Ca,
            CountryCode.Gb,
            CountryCode.Ie,
            CountryCode.Fr,
            CountryCode.Es,
            CountryCode.Nl,
          ],
          language: 'en',
          access_token: accountInfo.accessToken as string,
        });

        res.json({ token: linkTokenResponse.data.link_token, type: 'UPDATE_REQUIRED' });
      } else throw error;
    }
  } catch (error) {
    console.log(error);
    if (error?.response?.data?.display_message) {
      res.status(400).json({ message: error.response.data.display_message });
    } else
      res.status(500).json({
        error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error',
          stack: error.stack,
        },
      });
  }
});

export default router;
