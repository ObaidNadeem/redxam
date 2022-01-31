import { connect, connection, ConnectionOptions } from 'mongoose';

const { MONGODB_URL } = process.env;

const MONGO_OPTS: ConnectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

connect(MONGODB_URL, MONGO_OPTS);

connection.on('connecting', () => console.debug('[mongodb] connecting'));
connection.on('connected', () => console.debug('[mongodb] connected'));
connection.on('disconnecting', () => console.debug('[mongodb] disconnecting'));
connection.on('close', () => console.debug('[mongodb] close'));

export * from './model/contribution.model';
export * from './model/manualUser.model';
export * from './model/referrer.model';
export * from './model/totalPrice.model';
export * from './model/user.model';
export * from './model/wallet.model';
export * from './model/vault.model';
export * from './model/deposits.model';
export * from './model/internalDeposits.model';
export * from './model/admin.model';
export * from './model/changeRequest.model';
export * from './model/featureBlock.model';
export * from './enums';
