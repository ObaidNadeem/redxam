import { BlockchairSetup } from './config';
import {
  BCApiPagination,
  BCStats,
  BCWalletInfoResponse,
  BCTxInfoResponse,
  Hashstring,
  WalletTxParams,
} from './types';

export { config } from './config';
export * from './types';

export class Blockchair extends BlockchairSetup {
  public stats() {
    return this.get<BCStats>('stats');
  }

  public async getWalletInfo(wallet: { address: Hashstring; wif: string }, userId: string) {
    const walletInfo = await this.get<BCWalletInfoResponse>(
      `dashboards/address/${wallet.address}?limit=0`,
    ).then(res => {
      return res.data?.[wallet.address].address ?? null;
    });
    return walletInfo && { wallet, ...walletInfo, userId };
  }

  private paginationToString(pagination: BCApiPagination) {
    const { tx, utxo } = pagination;
    return `${tx},${utxo}`;
  }

  private normalizePagination(
    limit: BCApiPagination | number,
    offset: BCApiPagination | number = 0,
  ): BCApiPagination {
    const valueOf = (value: BCApiPagination | number, key: 'tx' | 'utxo') =>
      typeof value === 'number' ? value : value[key] ?? 0;
    const normalize = (key: 'tx' | 'utxo') => valueOf(limit, key) + valueOf(offset, key);
    return { tx: normalize('tx'), utxo: normalize('utxo') };
  }

  public async getWalletTxs(
    address: Hashstring,
    limit: number | BCApiPagination = 100,
    offset: number | BCApiPagination = 0,
  ) {
    const pageLimit = this.normalizePagination(limit);
    const pageOffset = this.normalizePagination(offset);
    const nextParams = [
      address,
      pageLimit,
      this.normalizePagination(pageLimit, pageOffset),
    ] as WalletTxParams;

    return {
      data: await this.get<BCWalletInfoResponse>(`dashboards/address/${address}`, {
        limit: this.paginationToString(pageLimit),
        offset: this.paginationToString(pageOffset),
      }) /* eslint-enable @typescript-eslint/indent */
        .then(res => ({ ...res.data[address], address })),
      next: () => this.getWalletTxs(...nextParams),
      nextParams,
    };
  }

  public async getTxDetails(txList: string[]) {
    const txsInfo = [];
    for (let i = 0; i < txList.length; i += 10) {
      const shortedTxList = txList.slice(i, i + 10);
      const txs = shortedTxList.join(',');
      const txsInfoObj = await this.get<BCTxInfoResponse>(
        `dashboards/transactions/${txs}`,
      ).then(res => res.data ?? null);
      txsInfo.push(...shortedTxList.map(key => txsInfoObj[key]));
    }
    return txsInfo;
  }
  
  public async broadcastTx(txHash: Hashstring) {
    return this.post('push/transaction', {
      data: txHash,
    });
    // TODO: Check if this was successful
  }
}

const Singleton = new Blockchair();

export default Singleton;
