import { Token } from "./token";

export class BitcoinBitcoinMainnetToken implements Token {
  readonly name =  'Bitcoin';
  readonly symbol = 'BTC';
  readonly network = 'Bitcoin';
  readonly isTestNet;
  
  constructor() {
    this.isTestNet = false;
  }

  createAddress(): string {
    return 'New BTC address';
  }

  validateAddress(address: string): boolean {
    return true;
  }

  sendToAddress(address: string, amount: number): boolean {
    return true;
  }

  getBalance(address: string): number {
    return 10.20;
  }

  // Methods not defined in the interface should be private
  private someBitcoinMethod (): void {
    // ...    
  }
}
