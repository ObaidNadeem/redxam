declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET_DEV: string;
    STRIPE_WEBHOOK_SECRET_PROD: string;
  }
}
