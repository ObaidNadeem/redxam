import Twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID } = process.env;

export const twilio = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
export const verify = (target: string) => twilio
  .verify
  .services(TWILIO_SERVICE_ID)
  .verifications
  .create({ to: target, channel: 'sms' });

export const verificationCheck = (target: string, code: string) => twilio
  .verify
  .services(TWILIO_SERVICE_ID)
  .verificationChecks
  .create({ to: target, code });
