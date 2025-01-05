import { Address } from "viem";

export interface PoolData {
  fee: number; // e.g. 3000 (which is 0.3%)
  liquidity: string; // e.g. '138233845669244492940'
  currentTick: number; // e.g. 62149
  tickSpacing: number; // e.g. 60
  sqrtPriceX96: string; // e.g. '1771595571142957102961017161607'
}

export interface PoolInfo {
  networkId: number;
  address: Address;
  token0Address: Address;
  token1Address: Address;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  tickSpacing: number;
  createdAt: number;
}
