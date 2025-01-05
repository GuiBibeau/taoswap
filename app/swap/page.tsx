import { TradingInterface } from "@/app/components/swap/swap-card";
import { ConnectButton } from "../components/connect-button";
import { Suspense } from "react";
import { PriceTracker } from "../components/price-tracker";
import { Logo } from "../components/ui/logo";
import { getPoolDataFromChain } from "../lib/pools/pool-from-chain";
import { Address } from "viem";
import { parsePoolData } from "../lib/utils/pool-utils";

export default async function Swap() {
  const poolData = await getPoolDataFromChain(
    process.env.WTAO_USDC_3000 as Address
  );

  const parsedPoolData = parsePoolData(poolData);

  console.log(parsedPoolData);
  return (
    <>
      <div className="w-full border-b border-gray-200/5 dark:border-gray-200/[0.03]">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex relative items-center justify-between py-6 min-h-[72px]">
            <div className="flex items-center gap-4 min-h-[40px]">
              <Logo />
              <Suspense fallback={<div className="w-[200px]" />}>
                <PriceTracker />
              </Suspense>
            </div>
            <ConnectButton />
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32">
        <TradingInterface />
      </div>
    </>
  );
}
