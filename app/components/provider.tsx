"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { type Chain } from "viem";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const bittensorTestnet = {
  id: 945,
  name: "Test Subtensor EVM",
  nativeCurrency: {
    name: "Tao",
    symbol: "TAO",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://test.chain.opentensor.ai"] },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: "TaoSwap",
  projectId: "YOUR_PROJECT_ID",
  chains: [bittensorTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
