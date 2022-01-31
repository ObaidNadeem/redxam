/* eslint-disable @typescript-eslint/indent */
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { BinaryLike, createHmac } from 'crypto';
import { stringify as stringifyQs } from 'qs';
import {
  AllOrders,
  AllOrdersResponse,
  Balance,
  BalanceResponse,
  Price,
  PriceResponse,
  RequestData,
  BinanceAccount,
} from './types';

export * from './types';

// const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// TODO: Make accounts for binance prod and dev
const IS_PRODUCTION = true;

export class Binance {
  private static readonly API_KEY =
    process.env[IS_PRODUCTION ? 'BINANCE_API_KEY' : 'BINANCE_TEST_API_KEY'];
  public static readonly API_SECRET =
    process.env[IS_PRODUCTION ? 'BINANCE_API_SECRET' : 'BINANCE_TEST_API_SECRET'];
  public static readonly HOST_URL = process.env['BINANCE_API_URL'];
  private sign(data: BinaryLike) {
    return createHmac('SHA256', Binance.API_SECRET).update(data).digest('hex');
  }
  private axiosErrorHandler(error: AxiosError) {
    console.error(`Binance error: ${error.message}`);
    if (error.response?.data) {
      console.error('Data:', error.response.data);
    }
    return null;
  }
  private async request<T>(
    method: Method,
    endpoint: string,
    requestData: RequestData = {},
  ) {
    const dataQueryString = stringifyQs(requestData.params);
    const signature = this.sign(dataQueryString);
    const url = Binance.HOST_URL + endpoint;
    console.log('URL', url);
    const response = await axios({
      method,
      url,
      headers: {
        Accept: 'application/json',
        'X-MBX-APIKEY': Binance.API_KEY,
      },
      data: requestData.data,
      params: {
        ...requestData.params,
        signature,
      },
    }).catch(this.axiosErrorHandler);

    return response as AxiosResponse<T>;
  }
  /* PRICES */
  public async prices<Symbol extends string = 'BTCUSDT'>(symbol = 'BTCUSDT' as Symbol) {
    const response = await this.request<PriceResponse<Symbol>>(
      'GET',
      '/fapi/v1/ticker/price',
      { params: { symbol } },
    );
    if (!response) return null;

    return {
      symbol: response.data.symbol,
      price: parseFloat(response.data.price),
      time: response.data.time,
    } as Price<Symbol>;
  }
  /* BALANCES */
  public async balance(timestamp = Date.now()) {
    const response = await this.request<BinanceAccount>('GET', '/api/v3/account', {
      params: { timestamp },
    });
    if (!response) return null;

    return response.data.balances;
  }
  // public async allOrders<Symbol extends string = 'BTCUSDT'>(symbol = 'BTCUSDT' as Symbol, limit?: number) {
  //   if (limit && limit > 1000) {
  //     throw new RangeError('Max limit is 1000.');
  //   }

  //   const response = await this.request<AllOrdersResponse<Symbol>>('GET', '/api/v3/allOrders', {
  //     params: {
  //       symbol,
  //       userServerTime: true,
  //       recvWindow: 20000,
  //       limit,
  //       timestamp: Date.now(),
  //     },
  //   });

  //   if (!response) return null;
  //   const { data } = response;

  //   return {
  //     ...response.data,
  //     price: parseFloat(data.price),
  //     origQty: parseFloat(data.origQty),
  //     executedQty: parseFloat(data.executedQty),
  //     cummulativeQuoteQty: parseFloat(data.cummulativeQuoteQty),
  //     stopPrice: parseFloat(data.stopPrice),
  //     icebergQty: parseFloat(data.icebergQty),
  //     origQuoteOrderQty: parseFloat(data.origQuoteOrderQty),
  //   } as AllOrders<Symbol>;
  // }
}
