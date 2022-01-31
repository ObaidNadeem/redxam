import express from 'express';
import stripeWebhook from './stripe';

const router = express.Router();

router.post('/stripe', stripeWebhook);

export default router;
