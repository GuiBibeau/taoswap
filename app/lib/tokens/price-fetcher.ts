export type Currency = "usd" | "eur" | "gbp" | "jpy" | "cny";

export interface TokenPrice {
  price: number;
  currency: Currency;
  timestamp: number;
  formattedPrice: string;
  percentChange24h?: number;
}

export interface PriceError {
  error: string;
  timestamp: number;
}

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Formats a currency value based on the currency type
 */
const formatCurrencyValue = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};

/**
 * Fetches the current price of TAO (Bittensor) in the specified currency
 */
export async function fetchTaoPrice(
  currency: Currency = "usd"
): Promise<TokenPrice | PriceError> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=bittensor&vs_currencies=${currency}&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const price = data.bittensor[currency];
    const percentChange = data.bittensor[`${currency}_24h_change`];

    // Handle potential undefined or invalid data
    if (price === undefined) {
      return {
        error: "Invalid price data received",
        timestamp: Date.now(),
      };
    }

    return {
      price,
      currency,
      timestamp: Date.now(),
      formattedPrice: formatCurrencyValue(price, currency),
      percentChange24h: percentChange,
    };
  } catch (error) {
    console.error("Error fetching TAO price:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: Date.now(),
    };
  }
}
