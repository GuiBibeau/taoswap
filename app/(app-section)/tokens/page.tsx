import { getNetworkTokens } from "@/app/lib/tokens/token-storage";
import { bittensorTestnet } from "@/app/lib/wagmi";

async function getTokens() {
  try {
    return await getNetworkTokens(bittensorTestnet.id);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
}

export default async function TokensPage() {
  const tokens = await getTokens();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tokens</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tokens.map((token) => (
          <div
            key={token.address}
            className="flex flex-col p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <span className="text-lg font-medium">{token.symbol[0]}</span>
              </div>
              <div>
                <h3 className="font-medium text-lg">{token.symbol}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {token.name}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Decimals:</span>
                <span>{token.decimals}</span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span
                  className="font-mono truncate max-w-[180px]"
                  title={token.address}
                >
                  {token.address}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          No tokens found
        </div>
      )}
    </div>
  );
}
