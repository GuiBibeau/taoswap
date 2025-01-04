import { client as redisClient } from "@/app/lib/redis";
import { docClient } from "@/app/lib/dynamodb";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import {
  TokenPrice,
  PriceError,
  Currency,
  PriceHistoryItem,
} from "./price-types";

const PRICE_KEY_PREFIX = "token_price";
const ERROR_KEY_PREFIX = "price_error";
const PRICE_TABLE_NAME = "token_prices";

// Helper to generate Redis keys
const getPriceKey = (currency: Currency) => `${PRICE_KEY_PREFIX}:${currency}`;
const getErrorKey = (currency: Currency) => `${ERROR_KEY_PREFIX}:${currency}`;

// Store current price data in Redis
export async function storeTokenPrice(price: TokenPrice): Promise<void> {
  try {
    // Store current price in Redis
    await redisClient.set(
      getPriceKey(price.currency),
      JSON.stringify(price),
      "EX",
      60 * 5 // Cache for 5 minutes
    );

    // Store historical data in DynamoDB
    const historyItem: PriceHistoryItem = {
      assetId: `TAO_${price.currency.toUpperCase()}`,
      timestamp: price.timestamp,
      price: price.price,
      currency: price.currency,
      formattedPrice: price.formattedPrice,
    };

    await docClient.send(
      new PutCommand({
        TableName: PRICE_TABLE_NAME,
        Item: historyItem,
      })
    );
  } catch (error) {
    console.error("Error storing token price:", error);
    throw new Error("Failed to store token price");
  }
}

// Store error data in Redis
export async function storePriceError(
  error: PriceError,
  currency: Currency
): Promise<void> {
  try {
    await redisClient.set(
      getErrorKey(currency),
      JSON.stringify(error),
      "EX",
      60 * 5
    );
  } catch (error) {
    console.error("Error storing price error:", error);
    throw new Error("Failed to store price error");
  }
}

// Get current price data from Redis
export async function getTokenPrice(
  currency: Currency
): Promise<TokenPrice | null> {
  try {
    const data = await redisClient.get(getPriceKey(currency));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting token price:", error);
    throw new Error("Failed to get token price");
  }
}

// Get latest error from Redis
export async function getPriceError(
  currency: Currency
): Promise<PriceError | null> {
  try {
    const data = await redisClient.get(getErrorKey(currency));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting price error:", error);
    throw new Error("Failed to get price error");
  }
}

// Get historical price data from DynamoDB
export async function getPriceHistory(
  currency: Currency,
  start?: number,
  end: number = Date.now()
): Promise<TokenPrice[]> {
  try {
    const assetId = `TAO_${currency.toUpperCase()}`;
    const response = await docClient.send(
      new QueryCommand({
        TableName: PRICE_TABLE_NAME,
        KeyConditionExpression:
          "assetId = :assetId AND #ts BETWEEN :start AND :end",
        ExpressionAttributeNames: {
          "#ts": "timestamp",
        },
        ExpressionAttributeValues: {
          ":assetId": assetId,
          ":start": start || 0,
          ":end": end,
        },
      })
    );

    return (response.Items || []) as TokenPrice[];
  } catch (error) {
    console.error("Error getting price history:", error);
    throw new Error("Failed to get price history");
  }
}

// Delete price data
export async function deleteTokenPrice(currency: Currency): Promise<void> {
  try {
    await redisClient.del(getPriceKey(currency));
  } catch (error) {
    console.error("Error deleting token price:", error);
    throw new Error("Failed to delete token price");
  }
}
