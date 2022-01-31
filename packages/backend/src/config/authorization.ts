import { AuthorizedRequest } from '@/resolver/types';
import { Request } from 'express';
import { JWT, TokenPayload } from './jwt';
import { messages } from './messages';

export const authorize = <Params = Record<string, any>, R = any>(callback: AuthorizedRequest<Params, R>) => {
  return async (params: Params & { payload: TokenPayload }, req: Request) => {
    const payload = await new JWT().authorize(req.headers.authorization);
    if (!payload) return messages.failed.invalidToken;

    params.payload = payload;
    return callback(params, req);
  };
};
