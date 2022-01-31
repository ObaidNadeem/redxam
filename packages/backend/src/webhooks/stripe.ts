import express from 'express';
import { stripeInstance } from '@/apis/stripe';
import { Deposits } from '@/database';
import Stripe from 'stripe';

const router = express.Router();

/**
 * Stripe Webhook
 * Receives transaction & other event status changes from Stripe
 * ref: Stripe
 */
const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripeInstance.webhooks.constructEvent(
      // @ts-ignore
      req.rawBody,
      sig,
      process.env.NODE_ENV === 'production'
        ? process.env.STRIPE_WEBHOOK_SECRET_PROD
        : process.env.STRIPE_WEBHOOK_SECRET_DEV,
    );

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      if (charge.status === 'succeeded') {
        Deposits.updateOne(
          { userId: charge.metadata.user_id, stripeChargeId: charge.id },
          { $set: { status: 'completed' } },
        );
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
      },
    });
  }
};

export default stripeWebhook;
