import cors, { CorsOptions } from 'cors';
import { Express, static as staticAssets, json, urlencoded } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { resolver } from './resolver';
import { schema } from './schema';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import raven from 'raven';
import customFormatError from './customFormatError';

// Loggers
const logger = require('./logger');
const httpLogger = require('./httpLogger');

// Routes
import sumsub from './routes/sumsub';
import plaid from './routes/plaid';

// Webhooks
import webhooks from './webhooks';

const { NODE_ENV, SENTRY_DSN, SERVICE } = process.env;
const IS_PRODUCTION = NODE_ENV === 'production';

raven.config(SENTRY_DSN).install();

// Cors options
const corsOptions: CorsOptions = {
  origin: true,
};

export const config = (app: Express) => {
  // morgan http loger
  app.use(httpLogger);
  // Setup Sentry Tracker
  Sentry.init({
    environment: NODE_ENV,
    dsn: SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: IS_PRODUCTION ? 1.0 : 0,
  });
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
  app.use(raven.requestHandler());

  // Express middlewares
  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: true }));
  app.use(
    json({
      verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
          // @ts-ignore
          req.rawBody = buf.toString(encoding || 'utf8');
        }
      },
    }),
  );

  serviceHandler(app);

  app.use(Sentry.Handlers.errorHandler());

  // Serve static asstes
  app.use(staticAssets('assets'));
};

const serviceHandler = app => {
  switch (SERVICE) {
    case 'server':
      setupGraphql(app);
      app.use('/api/v2', sumsub);
      app.use('/api/v2/plaid', plaid);
      app.use('/', (req, res) => {
        res.send('V 1.1.0');
      });
      break;
    case 'webhooks':
      app.use('/api/webhooks/', webhooks);
      break;
  }
};

const setupGraphql = app => {
  const graphql = graphqlHTTP(req => ({
    schema,
    rootValue: resolver,
    graphiql: !IS_PRODUCTION,
    customFormatErrorFn: error => customFormatError(req, raven, error),
  }));
  app.use('/api/v1', graphql);
};
