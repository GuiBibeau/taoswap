import { Address } from "viem";

export type Currency = "usd" | "eur" | "gbp" | "jpy" | "cny";

export type TokenPrice = {
  price: number;
  currency: Currency;
  timestamp: number;
  formattedPrice: string;
  percentChange24h?: number;
};

export type PriceError = {
  error: string;
  timestamp: number;
};

export type PriceHistoryItem = {
  assetId: string;
  timestamp: number;
  price: number;
  currency: Currency;
  formattedPrice: string;
  volume?: number;
  marketCap?: number;
};

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  logoURI?: string;
};
