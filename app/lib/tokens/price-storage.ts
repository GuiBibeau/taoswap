import { client } from "@/app/lib/redis";
import { TokenPrice, PriceError, Currency } from "./price-fetcher";

const PRICE_KEY_PREFIX = "token_price";
const ERROR_KEY_PREFIX = "price_error";
const PRICE_HISTORY_KEY_PREFIX = "price_history";

// Helper to generate Redis keys
const getPriceKey = (currency: Currency) => `${PRICE_KEY_PREFIX}:${currency}`;
const getErrorKey = (currency: Currency) => `${ERROR_KEY_PREFIX}:${currency}`;
const getPriceHistoryKey = (currency: Currency) =>
  `${PRICE_HISTORY_KEY_PREFIX}:${currency}`;

// Store current price data
export async function storeTokenPrice(price: TokenPrice): Promise<void> {
  try {
    await client.set(
      getPriceKey(price.currency),
      JSON.stringify(price),
      "EX",
      60 * 5 // Cache for 5 minutes
    );

    // Also store in historical data
    await client.zadd(
      getPriceHistoryKey(price.currency),
      price.timestamp,
      JSON.stringify(price)
    );

    // Trim history to last 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    await client.zremrangebyscore(
      getPriceHistoryKey(price.currency),
      0,
      oneDayAgo
    );
  } catch (error) {
    console.error("Error storing token price:", error);
    throw new Error("Failed to store token price");
  }
}

// Store error data
export async function storePriceError(
  error: PriceError,
  currency: Currency
): Promise<void> {
  try {
    await client.set(
      getErrorKey(currency),
      JSON.stringify(error),
      "EX",
      60 * 5 // Cache for 5 minutes
    );
  } catch (error) {
    console.error("Error storing price error:", error);
    throw new Error("Failed to store price error");
  }
}

// Get current price data
export async function getTokenPrice(
  currency: Currency
): Promise<TokenPrice | null> {
  try {
    const data = await client.get(getPriceKey(currency));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting token price:", error);
    throw new Error("Failed to get token price");
  }
}

// Get latest error
export async function getPriceError(
  currency: Currency
): Promise<PriceError | null> {
  try {
    const data = await client.get(getErrorKey(currency));
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting price error:", error);
    throw new Error("Failed to get price error");
  }
}

// Get historical price data
export async function getPriceHistory(
  currency: Currency,
  start?: number,
  end: number = Date.now()
): Promise<TokenPrice[]> {
  try {
    const data = await client.zrangebyscore(
      getPriceHistoryKey(currency),
      start || 0,
      end
    );
    return data.map((item) => JSON.parse(item));
  } catch (error) {
    console.error("Error getting price history:", error);
    throw new Error("Failed to get price history");
  }
}

// Delete price data
export async function deleteTokenPrice(currency: Currency): Promise<void> {
  try {
    await Promise.all([
      client.del(getPriceKey(currency)),
      client.del(getPriceHistoryKey(currency)),
    ]);
  } catch (error) {
    console.error("Error deleting token price:", error);
    throw new Error("Failed to delete token price");
  }
}
