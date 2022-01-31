import { createTransport } from 'nodemailer';

const { SERVICE_HOST, SERVICE_PORT, USER_NAME, USER_PASS } = process.env;

export const transporter = createTransport({
  host: SERVICE_HOST,
  port: Number(SERVICE_PORT),
  auth: {
    user: USER_NAME,
    pass: USER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
