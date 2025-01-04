import { cookieStorage, createStorage, injected } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { Chain } from "@reown/appkit/networks";
import { walletConnect } from "wagmi/connectors";
import { metaMask } from "wagmi/connectors";

export const projectId = "44a3ab7bcd31b7ffa35330deed568d13";

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

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [bittensorTestnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [injected(), walletConnect({ projectId }), metaMask()],
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
