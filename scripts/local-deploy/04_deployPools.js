require("dotenv").config({
  path: ".env.local",
});

// Convert environment variables to constants
const ADDRESSES = {
  USDC: process.env.USDC_ADDRESS,
  WTAO: process.env.WTAO_ADDRESS,
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

const bn = require("bignumber.js");
const { updateEnvFile } = require("../utils/env");
const {
  createContract,
  encodePriceSqrt,
  saveContractInfo,
} = require("../utils/contracts");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

// Create contract instances
const createContracts = (signer) => ({
  nonfungiblePositionManager: createContract(
    ADDRESSES.POSITION_MANAGER,
    artifacts.NonfungiblePositionManager.abi,
    signer
  ),
  factory: createContract(
    ADDRESSES.FACTORY,
    artifacts.UniswapV3Factory.abi,
    signer
  ),
});

// Add this helper function
const sortTokens = (tokenA, tokenB) => {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
};

// Pure function for pool deployment
const deployPool = async (contracts, tokenA, tokenB, fee, price) => {
  // Sort tokens by address
  const [token0, token1] = sortTokens(tokenA, tokenB);

  // Create and initialize the pool
  await contracts.nonfungiblePositionManager.createAndInitializePoolIfNecessary(
    token0,
    token1,
    fee,
    price,
    {
      gasLimit: 5000000,
    }
  );

  // Get the pool address
  const poolAddress = await contracts.factory.getPool(token0, token1, fee);

  return poolAddress;
};

// Main execution function
const main = async () => {
  const [signer] = await ethers.getSigners();
  const contracts = createContracts(signer);
  const networkName = (await ethers.provider.getNetwork()).name || "local";

  // Sort tokens to determine correct price orientation
  const [token0, token1] = sortTokens(ADDRESSES.WTAO, ADDRESSES.USDC);
  const isWTAOToken0 = token0.toLowerCase() === ADDRESSES.WTAO.toLowerCase();

  // Adjust price based on token ordering
  const sqrtPrice = isWTAOToken0
    ? encodePriceSqrt(500, 1)
    : encodePriceSqrt(1, 500);

  // Deploy pool and get address
  const wtaoUsdcPoolAddress = await deployPool(
    contracts,
    ADDRESSES.WTAO,
    ADDRESSES.USDC,
    3000,
    sqrtPrice
  );

  // Save pool contract info
  await saveContractInfo(
    "WTAO_USDC_3000",
    {
      address: wtaoUsdcPoolAddress,
      abi: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json")
        .abi,
      provider: ethers.provider,
    },
    networkName
  );

  const poolAddresses = {
    WTAO_USDC_3000: wtaoUsdcPoolAddress,
  };

  return updateEnvFile(poolAddresses);
};

/*
npx hardhat run --network localhost scripts/local-deploy/04_deployPools.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
