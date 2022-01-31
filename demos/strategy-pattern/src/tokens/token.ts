export interface Token {
  readonly name: string;
  readonly symbol: string;
  readonly network: string;
  readonly isTestNet: boolean;

  createAddress(): string;
  validateAddress(address: string): boolean;
  sendToAddress(address: string, amount: number): boolean;
  getBalance(address: string): number;
}
