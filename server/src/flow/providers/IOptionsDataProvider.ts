export interface OptionTick {
  symbol: string;
  expiryDate: string;
  strikePrice: number;
  optionType: 'CE' | 'PE';
  ltp: number;
  openInterest: number;
  volume: number;
  timestamp: number;
  impliedVolatility?: number;
}

export interface IOptionsDataProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(symbols: string[]): Promise<void>;
  unsubscribe(symbols: string[]): Promise<void>;
  onTick(callback: (tick: OptionTick) => void): void;
}
