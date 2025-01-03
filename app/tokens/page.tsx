import { TOKENS } from "../lib/tokens/tokens";
import { Card } from "../components/ui/card";
import Image from "next/image";

export default function TokensPage() {
  // Get testnet tokens (chain ID 945)
  const testnetTokens = TOKENS[945];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Testnet Tokens</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(testnetTokens).map(([symbol, token]) => (
          <Card key={symbol} className="p-6">
            <div className="flex items-center space-x-4">
              {token.logoURI ? (
                <Image
                  src={token.logoURI}
                  alt={token.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{symbol.charAt(0)}</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{symbol}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {token.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mt-1">
                  {token.address}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
