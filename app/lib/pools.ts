import { Address, PublicClient } from "viem";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";

// Uniswap V3 Pool ABI (only the functions we need)
const poolAbi = [
  {
    inputs: [],
    name: "token0",
    outputs: [{ type: "address", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ type: "address", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fee",
    outputs: [{ type: "uint24", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tickSpacing",
    outputs: [{ type: "int24", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "liquidity",
    outputs: [{ type: "uint128", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "slot0",
    outputs: [
      { type: "uint160", name: "sqrtPriceX96" },
      { type: "int24", name: "tick" },
      { type: "uint16", name: "observationIndex" },
      { type: "uint16", name: "observationCardinality" },
      { type: "uint16", name: "observationCardinalityNext" },
      { type: "uint8", name: "feeProtocol" },
      { type: "bool", name: "unlocked" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 ABI (minimal for pool tokens)
const erc20Abi = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ type: "uint8", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface PoolData {
  token0Address: Address;
  token1Address: Address;
  fee: number;
  tickSpacing: number;
  liquidity: bigint;
  sqrtPriceX96: bigint;
  tick: number;
}

interface TokenData {
  address: Address;
  decimals: number;
  symbol: string;
  name: string;
}

interface PoolInfo extends PoolData {
  address: Address;
  token0: Token;
  token1: Token;
}

async function getPoolData(
  client: PublicClient,
  poolAddress: Address
): Promise<PoolData> {
  const [token0Address, token1Address, fee, tickSpacing, liquidity, slot0] =
    await client.multicall({
      contracts: [
        { address: poolAddress, abi: poolAbi, functionName: "token0" },
        { address: poolAddress, abi: poolAbi, functionName: "token1" },
        { address: poolAddress, abi: poolAbi, functionName: "fee" },
        { address: poolAddress, abi: poolAbi, functionName: "tickSpacing" },
        { address: poolAddress, abi: poolAbi, functionName: "liquidity" },
        { address: poolAddress, abi: poolAbi, functionName: "slot0" },
      ],
    });

  if (
    !token0Address.status ||
    !token1Address.status ||
    !fee.status ||
    !tickSpacing.status ||
    !liquidity.status ||
    !slot0.status ||
    !token0Address.result ||
    !token1Address.result ||
    !liquidity.result ||
    !slot0.result
  ) {
    throw new Error("Failed to fetch pool data");
  }

  return {
    token0Address: token0Address.result!,
    token1Address: token1Address.result!,
    fee: Number(fee.result),
    tickSpacing: Number(tickSpacing.result),
    liquidity: liquidity.result!,
    sqrtPriceX96: slot0.result![0],
    tick: Number(slot0.result![1]),
  };
}

async function getTokenData(
  client: PublicClient,
  tokenAddress: Address
): Promise<TokenData> {
  const [decimals, symbol, name] = await client.multicall({
    contracts: [
      { address: tokenAddress, abi: erc20Abi, functionName: "decimals" },
      { address: tokenAddress, abi: erc20Abi, functionName: "symbol" },
      { address: tokenAddress, abi: erc20Abi, functionName: "name" },
    ],
  });

  if (
    !decimals.status ||
    !symbol.status ||
    !name.status ||
    !decimals.result ||
    !symbol.result ||
    !name.result
  ) {
    throw new Error(`Failed to fetch token data for ${tokenAddress}`);
  }

  return {
    address: tokenAddress,
    decimals: Number(decimals.result!),
    symbol: symbol.result!,
    name: name.result!,
  };
}

export async function getPools(
  client: PublicClient,
  poolAddresses: Address[]
): Promise<PoolInfo[]> {
  try {
    const poolsData = await Promise.all(
      poolAddresses.map((address) => getPoolData(client, address))
    );

    // Get unique token addresses
    const tokenAddresses = [
      ...new Set(
        poolsData.flatMap((pool) => [pool.token0Address, pool.token1Address])
      ),
    ];

    // Fetch all token data in parallel
    const tokenDataMap = new Map(
      (
        await Promise.all(
          tokenAddresses.map((address) => getTokenData(client, address))
        )
      ).map((data) => [data.address, data])
    );

    const chainId = await client.getChainId();

    return poolsData.map((pool, i) => {
      const token0Data = tokenDataMap.get(pool.token0Address);
      const token1Data = tokenDataMap.get(pool.token1Address);

      if (!token0Data || !token1Data) {
        throw new Error("Missing token data");
      }

      const token0 = new Token(
        chainId,
        token0Data.address,
        token0Data.decimals,
        token0Data.symbol,
        token0Data.name
      );

      const token1 = new Token(
        chainId,
        token1Data.address,
        token1Data.decimals,
        token1Data.symbol,
        token1Data.name
      );

      return {
        address: poolAddresses[i],
        token0,
        token1,
        ...pool,
      };
    });
  } catch (error) {
    console.error("Error fetching pools:", error);
    throw error;
  }
}

// Helper function to create SDK Pool instances
export function createSDKPool(poolInfo: PoolInfo): Pool {
  return new Pool(
    poolInfo.token0,
    poolInfo.token1,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );
}
