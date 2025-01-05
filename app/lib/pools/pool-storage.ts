import { docClient } from "@/app/lib/dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Address } from "viem";
import { PoolInfo } from "./types";

const TABLE_NAME = "dex_pools";

// Create/Update pool
export async function storePool(
  networkId: number,
  pool: Omit<PoolInfo, "networkId">
): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          networkId,
          address: pool.address,
          token0Address: pool.token0Address,
          token1Address: pool.token1Address,
          token0Symbol: pool.token0Symbol,
          token1Symbol: pool.token1Symbol,
          fee: pool.fee,
          tickSpacing: pool.tickSpacing,
          createdAt: pool.createdAt || Date.now(),
        },
      })
    );
  } catch (error) {
    console.error("Error storing pool:", error);
    throw new Error("Failed to store pool");
  }
}

// Get pool by network ID and address
export async function getPool(
  networkId: number,
  address: Address
): Promise<PoolInfo | null> {
  try {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          networkId,
          address,
        },
      })
    );

    return response.Item as PoolInfo | null;
  } catch (error) {
    console.error("Error getting pool:", error);
    throw new Error("Failed to get pool");
  }
}

// Get all pools for a network
export async function getNetworkPools(networkId: number): Promise<PoolInfo[]> {
  try {
    const response = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "networkId = :networkId",
        ExpressionAttributeValues: {
          ":networkId": networkId,
        },
      })
    );

    return (response.Items as PoolInfo[]) || [];
  } catch (error) {
    console.error("Error getting network pools:", error);
    throw new Error("Failed to get network pools");
  }
}

// Get pools by token address
export async function getPoolsByToken(
  networkId: number,
  tokenAddress: Address
): Promise<PoolInfo[]> {
  try {
    const response = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "TokenPoolsIndex",
        KeyConditionExpression: "networkId = :networkId",
        FilterExpression:
          "token0Address = :tokenAddress OR token1Address = :tokenAddress",
        ExpressionAttributeValues: {
          ":networkId": networkId,
          ":tokenAddress": tokenAddress,
        },
      })
    );

    return (response.Items as PoolInfo[]) || [];
  } catch (error) {
    console.error("Error getting pools by token:", error);
    throw new Error("Failed to get pools by token");
  }
}

// Delete pool
export async function deletePool(
  networkId: number,
  address: Address
): Promise<void> {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          networkId,
          address,
        },
      })
    );
  } catch (error) {
    console.error("Error deleting pool:", error);
    throw new Error("Failed to delete pool");
  }
}
