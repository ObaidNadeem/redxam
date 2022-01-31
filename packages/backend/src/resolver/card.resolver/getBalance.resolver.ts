import { Request } from 'express';
import Stripe from 'stripe';

const { STRIPE_SECRET_KEY } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

/**
 * @todo getBalance missing from graphql schema?
 * @todo this resolver returns nothing
 */
export const getBalance = async () => {
  const methods = await stripe.paymentMethods.list({
    customer: 'cus_JCpFe8EofuE3HR',
    type: 'card',
  }).catch((error: Error) => {
    console.error(error.message);
    return null;
  });

  console.log(methods);
};
