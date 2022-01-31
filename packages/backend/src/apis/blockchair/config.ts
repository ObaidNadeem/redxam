import axios, { AxiosError, Method } from 'axios';
import { BCApiRequest, BCApiResponse } from './types';
const { BLOCKCHAIR_API_KEY, NODE_ENV } = process.env;

type Blockchain =
  | 'bitcoin'
  | 'bitcoin-cash'
  | 'ethereum'
  | 'litecoin'
  | 'bitcoin-sv'
  | 'dogecoin'
  | 'dash'
  | 'ripple'
  | 'groestlcoin'
  | 'stellar'
  | 'monero'
  | 'cardano'
  | 'zcash'
  | 'mixin'
  | 'tezos'
  | 'eos'
  | 'bitcoin-abc';

interface BlockchairConfig {
  /**
   * Blockchair API Url.
   * defaults to 'https://api.blockchair.com/'
   */
  apiurl: string;
  /**
   * Specifies which blockchain to use.
   * https://blockchair.com/api/docs#link_M01
   */
  blockchain: Blockchain;
  /**
   * Use testnet instead of mainnet. Only allowed for bitcoin and ethereum networks.
   * Defaults to `false`
   */
  testnet: boolean;
  /**
   * Global API key for Blockchair API.
   * Defaults to `BLOCKCHAIR_API_KEY` environment variable.
   */
  apikey: string;
}

const VALID_TESTNET_BLOCKCHAINS = Object.freeze<Blockchain>(['bitcoin', 'ethereum']);

export const config: BlockchairConfig = {
  apiurl: 'https://api.blockchair.com',
  blockchain: 'bitcoin' as Blockchain,
  testnet: NODE_ENV === 'development',
  apikey: BLOCKCHAIR_API_KEY,
};

type NewApiRequest = <Data extends Record<string, any>, Context = {}>(
  endpoint: string,
  params?: Record<string, unknown>,
) => BCApiResponse<Data, Context>;

export class BlockchairSetup {
  private _blockchain = config.blockchain;
  private _apiurl = config.apiurl;
  private _testnet = config.testnet;

  /**
   * Blockchair API key. Defaults to `BLOCKCHAIR_API_KEY` env variable.
   */
  constructor(private _apikey = config.apikey) {
    if (config.testnet && !VALID_TESTNET_BLOCKCHAINS.includes(config.blockchain)) {
      throw new Error('Testnet only allows bitcoin or ethereum coins!');
    }
  }

  protected get blockchain() {
    return this._blockchain;
  }

  protected get apiurl() {
    return `${this._apiurl}/${this.blockchain}` + (this.testnet ? '/testnet' : '');
  }

  protected get testnet() {
    return this._testnet;
  }

  protected get apikey() {
    return this.testnet ? undefined : this._apikey;
  }

  public setBlockchain(blockchain: Blockchain) {
    if (this.testnet && !VALID_TESTNET_BLOCKCHAINS.includes(blockchain)) {
      throw new Error(
        'You are currently connected to testnet! Valid blockchains include bitcoin or ethereum.',
      );
    }

    this._blockchain = blockchain;
    return this;
  }

  public setApiurl(url: string) {
    this._apiurl = url.endsWith('/') ? url.slice(0, -1) : url;
    return this;
  }

  public useTestnet(value = true, blockchain: 'bitcoin' | 'ethereum' = 'bitcoin') {
    this._testnet = value;
    this._blockchain = blockchain;
    return this;
  }

  private fetch: BCApiRequest = async function (endpoint, method, params = {}) {
    const res = await axios({
      url: `${this.apiurl}/${endpoint}`,
      method,
      params: {
        ...params,
        key: this.apikey,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res;
      })
      .catch((error: AxiosError) => {
        console.error(`Blockchair error: ${error.message}`);
        if (error.response?.data) {
          console.error('Error data:', error.response.data);
        }
        return error.response;
      });

    return res.data;
  };

  private createApiRequest(method: Method): NewApiRequest {
    return (endpoint, params?) => {
      return this.fetch(endpoint, method, params);
    };
  }

  protected get get() {
    return this.createApiRequest('GET');
  }
  
  protected get post() {
    return this.createApiRequest('POST');
  }
}
