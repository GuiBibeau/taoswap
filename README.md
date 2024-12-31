## TaoSwap Finance

TaoSwap Finance is a series of financial primitives for the Bittensor Ecosystem

## Prerequisites

- Node.js
- MetaMask extension (with two different accounts)
- PNPM

## Getting Started

Local DEX setup:

1. Download metamask and create two accounts
2. Add the private keys from .env.local to the two accounts
3. install dependencies with `pnpm install`

Repeat this each time you restart your development environment:

1. run `pnpm run node` to start the local network.
2. In a second terminal run `npx hardhat run --network localhost scripts/01_deployContracts.js` to deploy the contracts
3. In a third terminal run `pnpm run dev` to start the frontend
