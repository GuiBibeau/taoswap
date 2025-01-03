import { Address } from "viem";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  logoURI?: string;
}

export interface TokenList extends Record<number, Record<string, TokenInfo>> {}

// Bittensor Mainnet tokens (Chain ID: TBD)
const MAINNET_TOKENS: Record<string, TokenInfo> = {
  //   WETH: {
  //     name: "Wrapped TAO",
  //     symbol: "WTAO",
  //     decimals: 18,
  //     address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Placeholder - update when deployed
  //     logoURI: "/tokens/tao.png",
  //   },
  //   USDC: {
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     decimals: 6,
  //     address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Placeholder - update when deployed
  //     logoURI: "/tokens/usdc.png",
  //   },
  //   USDT: {
  //     name: "Tether USD",
  //     symbol: "USDT",
  //     decimals: 6,
  //     address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Placeholder - update when deployed
  //     logoURI: "/tokens/usdt.png",
  //   },
};

// Bittensor Testnet tokens (Chain ID: 945)
const TESTNET_TOKENS: Record<string, TokenInfo> = {
  WTAO: {
    name: "Wrapped TAO",
    symbol: "WTAO",
    decimals: 18,
    address: "0x2518FB16EBc0A39f49302AB13B57729Ed01E989F", // Update with actual testnet address
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Update with actual testnet address
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    address: "0x42382F15b4cF50B8DFAE51063cE1EbA37B5b442D", // Update with actual testnet address
  },
};

export const TOKENS: TokenList = {
  // Mainnet ID will be added when available
  945: TESTNET_TOKENS, // Bittensor testnet
};

export function getToken(
  chainId: number,
  symbol: string
): TokenInfo | undefined {
  return TOKENS[chainId]?.[symbol];
}
