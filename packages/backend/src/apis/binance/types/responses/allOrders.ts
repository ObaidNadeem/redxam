export interface AllOrdersResponse<Symbol> {
  symbol: Symbol;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
}

export interface AllOrders<Symbol> {
  symbol: Symbol;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: number;
  origQty: number;
  executedQty: number;
  cummulativeQuoteQty: number;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  stopPrice: number;
  icebergQty: number;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: number;
}
