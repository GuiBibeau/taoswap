import { PoolChainData } from "../pools/pool-from-chain";

/**
 * Converts the Uniswap V3 sqrtPriceX96 encoding into a decimal price (token1 per token0).
 * @param sqrtPriceX96 BigInt representation of the sqrtPriceX96 from the pool.
 * @returns The price as a floating-point number (token1/token0).
 */
export function getPriceFromSqrtPriceX96(sqrtPriceX96: bigint): number {
  // 2^96 as a BigInt
  const Q96 = BigInt(1) << BigInt(96); // same as 2^96

  // sqrtP = sqrtPriceX96 / 2^96 (in decimal)
  // We'll convert to a floating-point approximation, then square it.

  const sqrtPriceFloat = Number(sqrtPriceX96) / Number(Q96);
  const price = sqrtPriceFloat * sqrtPriceFloat;

  return price;
}

/**
 * Computes the price (token1 per token0) from a given tick.
 * @param tick The current tick (e.g. 62149).
 * @returns Price as a floating-point number.
 */
export function getPriceFromTick(tick: number): number {
  // 1.0001^tick
  // We can do Math.pow but it's safer to use exponent/log.
  // 1.0001 = e^(ln(1.0001)) ~ e^(0.0001)

  const LOG_1_0001 = Math.log(1.0001);
  const price = Math.exp(LOG_1_0001 * tick);

  return price;
}

/**
 * Returns the liquidity as a BigInt from a string, or optionally as a shortened string for display.
 * @param liquidityStr e.g. '138233845669244492940'
 * @param toDisplay Whether to return a short display string or raw bigint. Defaults false => raw bigint.
 * @returns bigint or display string
 */
export function parseLiquidity(
  liquidityStr: string,
  toDisplay = false
): bigint | string {
  const liquidityBigInt = BigInt(liquidityStr);

  if (!toDisplay) {
    return liquidityBigInt;
  }

  // Optionally format e.g. "138.23B" or similar
  // For example, here’s a naive shortener:
  const rawNumber = Number(liquidityBigInt);
  if (rawNumber >= 1e9) {
    return (rawNumber / 1e9).toFixed(2) + "B";
  } else if (rawNumber >= 1e6) {
    return (rawNumber / 1e6).toFixed(2) + "M";
  } else if (rawNumber >= 1e3) {
    return (rawNumber / 1e3).toFixed(2) + "k";
  }
  return rawNumber.toString();
}

// Optional: Keep your existing parsing function to transform the raw data
export function parsePoolData(poolData: PoolChainData) {
  const priceFromSqrt = getPriceFromSqrtPriceX96(poolData.sqrtPriceX96);
  const priceFromTick = getPriceFromTick(poolData.currentTick);

  return {
    feeBps: Number(poolData.fee),
    priceFromSqrt,
    priceFromTick,
    sqrtPriceX96: poolData.sqrtPriceX96,
    liquidity: poolData.liquidity,
    tickSpacing: poolData.tickSpacing,
    token0: poolData.token0,
    token1: poolData.token1,
  };
}
