import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { walletConnect, metaMask } from "wagmi/connectors";

export const projectId = "44a3ab7bcd31b7ffa35330deed568d13";

export const bittensorTestnet = {
  id: 945,
  name: "Test Subtensor EVM",
  network: "bittensorTestnet",
  nativeCurrency: {
    name: "Tao",
    symbol: "TAO",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://test.chain.opentensor.ai"] },
    public: { http: ["https://test.chain.opentensor.ai"] },
  },
} as const;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const config = createConfig({
  chains: [bittensorTestnet],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [bittensorTestnet.id]: http(),
  },
  connectors: [walletConnect({ projectId }), metaMask()],
  ssr: true,
});
