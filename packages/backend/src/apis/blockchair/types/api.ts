import { Method } from 'axios';

/**
 * Date parseable string
 */
export type Datestring = string;

/**
 * Date parseable number
 */
export type Timestamp = number;

/**
 * Hash-like string
 */
export type Hashstring = string;
export type ScripthashType = 'scripthash'|'witness_v0_scripthash';

export type BCApiResponse<Data, Context> = Promise<{
  data: Data;
  context: ExtendedContext<Context>;
}>;

export type BCApiRequest = <Data extends Record<string, any>, Context = {}>(
  endpoint: string,
  method: Method,
  params?: Record<string, any>,
) => BCApiResponse<Data, Context>;

export type ExtendedContext<T> = BCContext & T;
export interface BCContext {
  code: number;
  source: string;
  state: number;
  cache: {
    live: boolean;
    duration: string;
    since: Datestring;
    until: Datestring;
    time: number;
  };
  api: {
    version: string;
    last_major_update: string;
    next_major_update: string;
    documentation: string;
    notice: string;
  };
  server: string;
  time: number;
  render_time: number;
  full_time: number;
  request_cost: number;
}
