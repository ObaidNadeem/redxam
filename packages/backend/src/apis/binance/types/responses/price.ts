export interface PriceResponse<Symbol extends string = string> {
  symbol: Symbol;
  price: string;
  time: number;
}

export interface Price<Symbol extends string = string> {
  symbol: Symbol;
  price: number;
  time: number;
}
