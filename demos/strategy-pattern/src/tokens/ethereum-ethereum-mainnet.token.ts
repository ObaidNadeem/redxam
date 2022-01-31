import { Token } from "./token";

export class EthereumEthereumMainnetToken implements Token {
  readonly name = 'Ethereum';
  readonly symbol = 'ETH';
  readonly network = 'Ethereum';
  readonly isTestNet = false;
  
  createAddress(): string {
    return 'New ETH address';
  }

  validateAddress(address: string): boolean {
    return true;
  }

  sendToAddress(address: string, amount: number): boolean {
    return true;
  }

  getBalance(address: string): number {
    return 20.10;
  }

  // Methods not defined in the interface should be private
  private someEthereumMethod (): void {
    // ...    
  }
}
