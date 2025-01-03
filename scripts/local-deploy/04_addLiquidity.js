require("dotenv").config({
  path: ".env.local",
});

const { USDC_ADDRESS, POSITION_MANAGER_ADDRESS, WTAO_USDC_3000, WTAO_ADDRESS } =
  process.env;

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Usdc: require("../../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
  WrappedTao: require("../../artifacts/contracts/WTAO.sol/WTAO.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");
const { createContract } = require("../utils/contracts");

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

const main = async () => {
  const [owner, signer2] = await ethers.getSigners();
  const provider = ethers.provider;

  console.log("Adding liquidity with address:", signer2.address);

  // Create contract instances
  const usdcContract = createContract(
    USDC_ADDRESS,
    artifacts.Usdc.abi,
    provider
  );
  const wtaoContract = createContract(
    WTAO_ADDRESS,
    artifacts.WrappedTao.abi,
    provider
  );
  const poolContract = createContract(
    WTAO_USDC_3000,
    artifacts.UniswapV3Pool.abi,
    provider
  );

  // First deposit TAO to get WTAO
  console.log("Depositing TAO to get WTAO...");
  const depositAmount = ethers.utils.parseEther("10"); // 10 TAO
  await wtaoContract.connect(signer2).deposit({ value: depositAmount });

  console.log("Approving tokens...");
  const approvalAmount = ethers.utils.parseEther("10");
  await Promise.all([
    wtaoContract
      .connect(signer2)
      .approve(POSITION_MANAGER_ADDRESS, approvalAmount),
    usdcContract
      .connect(signer2)
      .approve(POSITION_MANAGER_ADDRESS, approvalAmount),
  ]);

  const poolData = await getPoolData(poolContract);
  console.log("Pool data retrieved:", {
    fee: poolData.fee.toString(),
    liquidity: poolData.liquidity.toString(),
    tick: poolData.tick,
  });

  const tokens = {
    token0: new Token(31337, WTAO_ADDRESS, 18, "WTAO", "Wrapped TAO"),
    token1: new Token(31337, USDC_ADDRESS, 18, "USDC", "USD Coin"),
    token0Address: WTAO_ADDRESS,
    token1Address: USDC_ADDRESS,
  };

  const pool = createPool(tokens.token0, tokens.token1, poolData);
  const position = new Position({
    pool,
    liquidity: ethers.utils.parseEther("10"),
    tickLower: nearestUsableTick(
      poolData.tick - poolData.tickSpacing * 2,
      poolData.tickSpacing
    ),
    tickUpper: nearestUsableTick(
      poolData.tick + poolData.tickSpacing * 2,
      poolData.tickSpacing
    ),
  });

  const nonfungiblePositionManager = createContract(
    POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    provider
  );

  console.log("Adding liquidity to pool...");
  const mintParams = {
    token0: tokens.token0Address,
    token1: tokens.token1Address,
    fee: poolData.fee,
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
    amount0Desired: position.mintAmounts.amount0.toString(),
    amount1Desired: position.mintAmounts.amount1.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer2.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const tx = await nonfungiblePositionManager
    .connect(signer2)
    .mint(mintParams, {
      gasLimit: "1000000",
    });

  await tx.wait();
  console.log("Liquidity added successfully!");
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
