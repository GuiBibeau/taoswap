require("dotenv").config({
  path: ".env.local",
});

const { ethers } = require("hardhat");
const {
  createContract,
  approveToken,
  saveContractInfo,
  revokeApproval,
} = require("../utils/contracts");

// Import necessary artifacts
const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  ERC20: require("@openzeppelin/contracts/build/contracts/ERC20.json"),
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
};

// Get addresses from environment
const ADDRESSES = {
  USDC: process.env.USDC_ADDRESS,
  WTAO: process.env.WTAO_ADDRESS,
  POSITION_MANAGER: process.env.POSITION_MANAGER_ADDRESS,
};

const addLiquidity = async (signer) => {
  console.log("Adding liquidity...");

  // Create contract instances
  const positionManager = createContract(
    ADDRESSES.POSITION_MANAGER,
    artifacts.NonfungiblePositionManager.abi,
    signer
  );
  const wtao = createContract(ADDRESSES.WTAO, artifacts.ERC20.abi, signer);
  const usdc = createContract(ADDRESSES.USDC, artifacts.ERC20.abi, signer);

  // Amount to add as liquidity
  const wtaoAmount = ethers.utils.parseEther("0.1");
  const usdcAmount = ethers.utils.parseEther("50");

  // Revoke approval
  console.log("Revoking approval...");
  await revokeApproval(wtao, signer, ADDRESSES.POSITION_MANAGER);
  await revokeApproval(usdc, signer, ADDRESSES.POSITION_MANAGER);

  // Approve tokens
  console.log("Approving tokens...");
  await approveToken(wtao, signer, ADDRESSES.POSITION_MANAGER, wtaoAmount);
  await approveToken(usdc, signer, ADDRESSES.POSITION_MANAGER, usdcAmount);

  // Sort tokens by address (required by Uniswap V3)
  const [token0, token1] =
    ADDRESSES.WTAO.toLowerCase() < ADDRESSES.USDC.toLowerCase()
      ? [ADDRESSES.WTAO, ADDRESSES.USDC]
      : [ADDRESSES.USDC, ADDRESSES.WTAO];

  const [amount0, amount1] =
    ADDRESSES.WTAO.toLowerCase() < ADDRESSES.USDC.toLowerCase()
      ? [wtaoAmount, usdcAmount]
      : [usdcAmount, wtaoAmount];

  // Get the pool contract to check current state
  const factory = createContract(
    process.env.FACTORY_ADDRESS,
    artifacts.UniswapV3Factory.abi,
    signer
  );
  const poolAddress = await factory.getPool(token0, token1, 3000);
  const poolContract = new ethers.Contract(
    poolAddress,
    require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json").abi,
    signer
  );

  // Get current tick from pool
  const { tick } = await poolContract.slot0();
  console.log("Current pool tick:", tick.toString());

  // Calculate tick range around current tick
  const tickSpacing = 60;
  const tickRange = 2000; // Wider range to ensure liquidity
  const nearestLowerTick =
    Math.ceil((tick - tickRange) / tickSpacing) * tickSpacing;
  const nearestUpperTick =
    Math.floor((tick + tickRange) / tickSpacing) * tickSpacing;

  console.log("Adding liquidity with parameters:");
  console.log("Token0:", token0);
  console.log("Token1:", token1);
  console.log("Amount0:", amount0.toString());
  console.log("Amount1:", amount1.toString());
  console.log("Tick Range:", nearestLowerTick, "-", nearestUpperTick);

  // Mint new position
  const tx = await positionManager.mint(
    {
      token0,
      token1,
      fee: 3000,
      tickLower: nearestLowerTick,
      tickUpper: nearestUpperTick,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signer.address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    },
    { gasLimit: 5000000 }
  );

  const receipt = await tx.wait();
  const event = receipt.events.find(
    (event) => event.event === "IncreaseLiquidity"
  );
  const tokenId = event.args.tokenId;

  console.log("Liquidity added successfully!");
  console.log("Token ID:", tokenId.toString());

  return tokenId;
};

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Adding liquidity with address:", signer.address);

  const tokenId = await addLiquidity(signer);
}

/*
npx hardhat run --network localhost scripts/local-deploy/05_addLiquidity.js
npx hardhat run --network bittensorTestnet scripts/local-deploy/05_addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
