import { Address, http, createPublicClient } from "viem";
import UniswapV3PoolArtifact from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";

import { bittensorTestnet } from "../wagmi";

// Use the abi from the artifact
const UniswapV3PoolABI = UniswapV3PoolArtifact.abi;

export type PoolChainData = {
  fee: bigint;
  liquidity: bigint;
  currentTick: number;
  tickSpacing: number;
  sqrtPriceX96: bigint;
  token0: Address;
  token1: Address;
  observationIndex: number;
  observationCardinality: number;
};

const client = createPublicClient({
  chain: bittensorTestnet,
  transport: http(),
});

export async function getPoolDataFromChain(
  poolAddress: Address
): Promise<PoolChainData> {
  // Get basic pool data
  const [fee, liquidity, tickSpacing, slot0, token0, token1] =
    (await Promise.all([
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "fee",
      }),
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "liquidity",
      }),
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "tickSpacing",
      }),
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "slot0",
      }),
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "token0",
      }),
      client.readContract({
        address: poolAddress,
        abi: UniswapV3PoolABI,
        functionName: "token1",
      }),
    ])) as [
      bigint,
      bigint,
      number,
      [bigint, number, number, number, boolean, number],
      Address,
      Address
    ];

  return {
    fee,
    liquidity,
    currentTick: Number(slot0[1]),
    tickSpacing: Number(tickSpacing),
    sqrtPriceX96: slot0[0],
    token0,
    token1,
    observationIndex: Number(slot0[2]),
    observationCardinality: Number(slot0[3]),
  };
}
