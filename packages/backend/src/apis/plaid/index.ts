import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath:
    process.env.NODE_ENV === 'development'
      ? PlaidEnvironments.sandbox
      : PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET':
        process.env.NODE_ENV === 'development'
          ? process.env.PLAID_SECRET_DEV
          : process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
