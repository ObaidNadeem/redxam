import { TokenPayload } from '@/config/jwt';
import { Request } from 'express';

export * from './inputs';

export type Argument<T> = { arg: T };

export type AuthorizedRequest<T, R> = (
  params: T & { payload: TokenPayload },
  req: Request
) => R;
