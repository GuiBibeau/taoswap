"use client";

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { TokenSelector, type Token } from "@/app/components/ui/token-selector";

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "wTAO", name: "Wrapped TAO" },
];

export function TradingInterface() {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full px-4">
      <Card className="bg-white dark:bg-zinc-900">
        <div className="flex flex-col gap-4 p-4">
          {/* Sell Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-900 dark:text-zinc-100 text-base font-medium">
                Sell
              </span>
              <div className="flex items-center gap-2">
                <TokenSelector
                  value={selectedToken}
                  onChange={setSelectedToken}
                  tokens={tokens}
                />
                <Button plain>Max</Button>
              </div>
            </div>

            <Input
              type="number"
              placeholder="0"
              className="text-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />

            <div className="text-zinc-500 dark:text-zinc-400 text-sm">$0</div>
          </div>

          {/* Buy Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-900 dark:text-zinc-100 text-base font-medium">
                Buy
              </span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-900 dark:text-zinc-100">0 wTAO</span>
              </div>
            </div>

            <Input
              type="number"
              placeholder="0"
              className="text-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />

            <div className="text-zinc-500 dark:text-zinc-400 text-sm">$0</div>
          </div>

          {/* Action Button */}
          <Button color="dark/white" className="w-full">
            Enter an amount
          </Button>
        </div>
      </Card>
    </div>
  );
}
