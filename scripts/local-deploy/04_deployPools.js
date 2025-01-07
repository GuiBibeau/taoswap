require("dotenv").config({
  path: ".env.local",
});

// Hard-coded token configurations
const TOKENS = {
  WTAO: {
    name: "Wrapped TAO",
    address: "0x6C2f20dae68c1035bCf1993027a03b685384DC7E",
    decimals: 18,
  },
  USDC: {
    name: "USD Coin",
    address: "0xFDD1867EBd17B25F5fCBf5Ec49C06Db8F912e96D",
    decimals: 6,
  },
};

const POOLS = {
  WTAO_USDC_3000: {
    tokens: [TOKENS.WTAO, TOKENS.USDC],
    fee: 3000,
    baseToken: "USDC", // The token we're pricing against
    price: 500, // 1 WTAO = 500 USDC
  },
};

// Convert environment variables to constants
const ADDRESSES = {
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

// Helper to calculate the correct sqrt price based on token order and decimals
const calculateSqrtPrice = (pool, token0, token1) => {
  const [tokenA, tokenB] = pool.tokens;
  const baseTokenIsToken0 =
    token0.toLowerCase() === TOKENS[pool.baseToken].address.toLowerCase();

  // Adjust for decimal differences
  const decimalDiff = tokenA.decimals - tokenB.decimals;
  const adjustedPrice = pool.price * Math.pow(10, decimalDiff);

  return baseTokenIsToken0
    ? encodePriceSqrt(1, adjustedPrice)
    : encodePriceSqrt(adjustedPrice, 1);
};

// Main execution function
const main = async () => {
  const [signer] = await ethers.getSigners();
  const contracts = createContracts(signer);
  const networkName = (await ethers.provider.getNetwork()).name || "local";

  const pool = POOLS.WTAO_USDC_3000;
  const [token0, token1] = sortTokens(
    pool.tokens[0].address,
    pool.tokens[1].address
  );

  const sqrtPrice = calculateSqrtPrice(pool, token0, token1);

  // Deploy pool and get address
  const wtaoUsdcPoolAddress = await deployPool(
    contracts,
    pool.tokens[0].address,
    pool.tokens[1].address,
    pool.fee,
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
npx hardhat run --network bittensorTestnet scripts/local-deploy/04_deployPools.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
