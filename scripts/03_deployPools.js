require("dotenv").config({
  path: ".env.local",
});

// Convert environment variables to constants
const ADDRESSES = {
  TETHER: process.env.TETHER_ADDRESS,
  USDC: process.env.USDC_ADDRESS,
  WRAPPED_BITCOIN: process.env.WRAPPED_BITCOIN_ADDRESS,
  WETH: process.env.WETH_ADDRESS,
  FACTORY: process.env.FACTORY_ADDRESS,
  SWAP_ROUTER: process.env.SWAP_ROUTER_ADDRESS,
  NFT_DESCRIPTOR: process.env.NFT_DESCRIPTOR_ADDRESS,
  POSITION_DESCRIPTOR: process.env.POSITION_DESCRIPTOR_ADDRESS,
  POSITION_MANAGER: process.env.POSITION_MANAGER_ADDRESS,
};

const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers");
const bn = require("bignumber.js");
const { updateEnvFile } = require("./utils/env");
const { createContract, encodePriceSqrt } = require("./utils/contracts");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// Create contract instances
const createContracts = (provider) => ({
  nonfungiblePositionManager: createContract(
    ADDRESSES.POSITION_MANAGER,
    artifacts.NonfungiblePositionManager.abi,
    provider
  ),
  factory: createContract(
    ADDRESSES.FACTORY,
    artifacts.UniswapV3Factory.abi,
    provider
  ),
});

// Pure function for pool deployment
const deployPool = async (contracts, token0, token1, fee, price) => {
  const [owner] = await ethers.getSigners();

  await contracts.nonfungiblePositionManager
    .connect(owner)
    .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
      gasLimit: 5000000,
    });

  return contracts.factory.connect(owner).getPool(token0, token1, fee);
};

// Main execution function
const main = async () => {
  const contracts = createContracts(ethers.provider);

  const poolAddresses = {
    USDT_USDC_500: await deployPool(
      contracts,
      ADDRESSES.TETHER,
      ADDRESSES.USDC,
      500,
      encodePriceSqrt(1, 1)
    ),
  };

  return updateEnvFile(poolAddresses);
};

/*
  npx hardhat run --network localhost scripts/03_deployPools.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
