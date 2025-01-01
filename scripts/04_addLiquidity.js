require("dotenv").config({
  path: ".env.local",
});

const {
  TETHER_ADDRESS,
  USDC_ADDRESS,
  POSITION_MANAGER_ADDRESS,
  USDT_USDC_500,
} = process.env;

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Usdt: require("../artifacts/contracts/Tether.sol/Tether.json"),
  Usdc: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

const createContract = (address, abi, provider) =>
  new Contract(address, abi, provider);

const approveToken = async (tokenContract, signer, spenderAddress, amount) => {
  await tokenContract.connect(signer).approve(spenderAddress, amount);
};

const getPoolData = async (poolContract) => {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing,
    fee,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
};

const createPool = (token0, token1, poolData) =>
  new Pool(
    token0,
    token1,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

const calculateTicks = (poolData) => {
  const baseTickNearest = nearestUsableTick(
    poolData.tick,
    poolData.tickSpacing
  );
  const tickOffset = poolData.tickSpacing * 2;

  return {
    tickLower: baseTickNearest - tickOffset,
    tickUpper: baseTickNearest + tickOffset,
  };
};

const createMintParams = (tokens, poolData, position, recipient) => ({
  token0: tokens.token0Address,
  token1: tokens.token1Address,
  fee: poolData.fee,
  ...calculateTicks(poolData),
  amount0Desired: position.mintAmounts.amount0.toString(),
  amount1Desired: position.mintAmounts.amount1.toString(),
  amount0Min: 0,
  amount1Min: 0,
  recipient,
  deadline: Math.floor(Date.now() / 1000) + 60 * 10,
});

const main = async () => {
  const [_owner, signer2] = await ethers.getSigners();
  const provider = ethers.provider;

  const usdtContract = createContract(
    TETHER_ADDRESS,
    artifacts.Usdt.abi,
    provider
  );
  const usdcContract = createContract(
    USDC_ADDRESS,
    artifacts.Usdc.abi,
    provider
  );
  const poolContract = createContract(
    USDT_USDC_500,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  const approvalAmount = ethers.utils.parseEther("1000");
  await Promise.all([
    approveToken(
      usdtContract,
      signer2,
      POSITION_MANAGER_ADDRESS,
      approvalAmount
    ),
    approveToken(
      usdcContract,
      signer2,
      POSITION_MANAGER_ADDRESS,
      approvalAmount
    ),
  ]);

  const poolData = await getPoolData(poolContract);

  const tokens = {
    token0: new Token(31337, TETHER_ADDRESS, 18, "USDT", "Tether"),
    token1: new Token(31337, USDC_ADDRESS, 18, "USDC", "UsdCoin"),
    token0Address: TETHER_ADDRESS,
    token1Address: USDC_ADDRESS,
  };

  const pool = createPool(tokens.token0, tokens.token1, poolData);

  const position = new Position({
    pool,
    liquidity: ethers.utils.parseEther("1"),
    ...calculateTicks(poolData),
  });

  const mintParams = createMintParams(
    tokens,
    poolData,
    position,
    signer2.address
  );

  const nonfungiblePositionManager = createContract(
    POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  const tx = await nonfungiblePositionManager
    .connect(signer2)
    .mint(mintParams, { gasLimit: "1000000" });
  await tx.wait();
};

/*
  npx hardhat run --network localhost scripts/04_addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
