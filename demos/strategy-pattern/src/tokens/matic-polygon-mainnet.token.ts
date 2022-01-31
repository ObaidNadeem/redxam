import { Token } from "./token";

export class PolygonMaticMainnetToken implements Token {
  readonly name = 'MATIC';
  readonly symbol = 'MATIC';
  readonly network = 'Polygon';
  readonly isTestNet = false;
  
  createAddress(): string {
    return 'New Matic address';
  }

  validateAddress(address: string): boolean {
    return true;
  }

  sendToAddress(address: string, amount: number): boolean {
    return true;
  }

  getBalance(address: string): number {
    return 20.20;
  }

  // Methods not defined in the interface should be private
  private somePolygonMethod (): void {
    // ...    
  }
}
