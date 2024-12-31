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

we will now use scripts to deploy the contracts, tokens, pools, and add liquidity.

2. In a second terminal run `npx hardhat run --network localhost scripts/01_deployContracts.js` to deploy the contracts
3. Now deploy the tokens with `npx hardhat run --network localhost scripts/02_deployTokens.js`
4. Now deploy the pools with `npx hardhat run --network localhost scripts/03_deployPools.js`
5. Now add liquidity to the pools with `npx hardhat run --network localhost scripts/04_addLiquidity.js`
6. Now check the liquidity with `npx hardhat run --network localhost scripts/05_checkLiquidity.js`

**Note: this will be automated quite soon in a single command**
