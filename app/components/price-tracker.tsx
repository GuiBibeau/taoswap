import { getTokenPrice } from "@/app/lib/tokens/price-storage";

async function getPriceData() {
  try {
    const priceData = await getTokenPrice("usd");
    return priceData;
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
}

export async function PriceTracker() {
  const priceData = await getPriceData();

  if (!priceData) {
    return null;
  }

  const priceChangeClass = priceData.percentChange24h
    ? priceData.percentChange24h > 0
      ? "text-green-500"
      : "text-red-500"
    : "text-zinc-500";

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full">
      <span className="text-xs text-zinc-400">TAO/USD</span>
      <span className="text-sm font-medium">τ{priceData.formattedPrice}</span>
      {priceData.percentChange24h && (
        <span className={`text-xs ${priceChangeClass}`}>
          {priceData.percentChange24h > 0 ? "+" : ""}
          {priceData.percentChange24h.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
