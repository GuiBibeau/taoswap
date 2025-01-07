import { Address } from "viem";
import { bittensorTestnet } from "@/app/lib/wagmi";
import { getPoolDataFromChain } from "@/app/lib/pools/pool-from-chain";
import { getTokenByAddress } from "@/app/lib/tokens/token-storage";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  DescriptionList,
  DescriptionDetails,
  DescriptionTerm,
} from "@/app/components/ui/description-list";
import { parsePoolData } from "@/app/lib/utils/pool-utils";

async function getPoolInfo(poolAddress: Address) {
  try {
    const poolData = await getPoolDataFromChain(poolAddress);
    const parsedPool = parsePoolData(poolData);

    // Get token information from storage
    const [token0Info, token1Info] = await Promise.all([
      getTokenByAddress(bittensorTestnet.id, parsedPool.token0),
      getTokenByAddress(bittensorTestnet.id, parsedPool.token1),
    ]);

    console.log(token0Info, token1Info);

    return {
      ...parsedPool,
      token0Info,
      token1Info,
    };
  } catch (error) {
    console.error("Error fetching pool info:", error);
    return null;
  }
}

export default async function PoolsPage() {
  const poolAddress = process.env.WTAO_USDC_3000 as Address;
  const poolInfo = await getPoolInfo(poolAddress);

  if (!poolInfo) {
    return <div>Error loading pool information</div>;
  }

  const formattedLiquidity = Number(poolInfo.liquidity).toLocaleString();
  const formattedFee = (poolInfo.feeBps / 10000).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Liquidity Pool Details
      </h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="mb-4">
              <h3 className="text-base/6 font-semibold text-zinc-950 dark:text-white">
                Pool Information
              </h3>
            </div>
            <DescriptionList className="grid gap-2">
              <div>
                <DescriptionTerm>Tokens</DescriptionTerm>
                <DescriptionDetails>
                  {poolInfo.token0Info?.symbol} / {poolInfo.token1Info?.symbol}
                </DescriptionDetails>
              </div>
              <div>
                <DescriptionTerm>Fee</DescriptionTerm>
                <DescriptionDetails>
                  <Badge>{formattedFee}%</Badge>
                </DescriptionDetails>
              </div>
              <div>
                <DescriptionTerm>Liquidity</DescriptionTerm>
                <DescriptionDetails>{formattedLiquidity}</DescriptionDetails>
              </div>
              <div>
                <DescriptionTerm>Current Price</DescriptionTerm>
                <DescriptionDetails>
                  {poolInfo.priceFromTick.toFixed(6)}
                </DescriptionDetails>
              </div>
            </DescriptionList>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="text-base/6 font-semibold text-zinc-950 dark:text-white">
                Token Details
              </h3>
            </div>
            <div className="space-y-4">
              <Card>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {poolInfo.token0Info?.logoURI && (
                      <img
                        src={poolInfo.token0Info.logoURI}
                        alt={poolInfo.token0Info.symbol}
                        className="w-8 h-8"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {poolInfo.token0Info?.symbol}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {poolInfo.token0Info?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {poolInfo.token1Info?.logoURI && (
                      <img
                        src={poolInfo.token1Info.logoURI}
                        alt={poolInfo.token1Info.symbol}
                        className="w-8 h-8"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {poolInfo.token1Info?.symbol}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {poolInfo.token1Info?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
