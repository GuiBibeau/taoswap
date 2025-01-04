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
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400"
    : "text-zinc-500 dark:text-zinc-400";

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-full border border-zinc-950/10 dark:border-white/10">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">TAO/USD</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-white">
        τ{priceData.formattedPrice}
      </span>
      {priceData.percentChange24h && (
        <span className={`text-xs ${priceChangeClass}`}>
          {priceData.percentChange24h > 0 ? "+" : ""}
          {priceData.percentChange24h.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
