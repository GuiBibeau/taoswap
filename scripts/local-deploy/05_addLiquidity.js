require("dotenv").config({
  path: ".env.local",
});

const { ethers } = require("hardhat");
const {
  createContract,
  approveToken,
  saveContractInfo,
} = require("../utils/contracts");

// Import necessary artifacts
const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  ERC20: require("@openzeppelin/contracts/build/contracts/ERC20.json"),
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
  const wtaoAmount = ethers.utils.parseEther("1");
  const usdcAmount = ethers.utils.parseEther("500");

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

  // Calculate price range
  const currentPrice = 500; // WTAO/USDC price
  const priceRange = 0.3; // 30% price range
  const lowerPrice = currentPrice * (1 - priceRange);
  const upperPrice = currentPrice * (1 + priceRange);

  // Convert prices to ticks
  const minTick = Math.floor(Math.log(lowerPrice) / Math.log(1.0001));
  const maxTick = Math.ceil(Math.log(upperPrice) / Math.log(1.0001));

  // Round to nearest tick spacing
  const tickSpacing = 60; // 0.3% fee tier
  const nearestLowerTick = Math.ceil(minTick / tickSpacing) * tickSpacing;
  const nearestUpperTick = Math.floor(maxTick / tickSpacing) * tickSpacing;

  console.log("Adding liquidity with parameters:");
  console.log("Token0:", token0);
  console.log("Token1:", token1);
  console.log("Amount0:", amount0.toString());
  console.log("Amount1:", amount1.toString());
  console.log("Tick Range:", nearestLowerTick, "-", nearestUpperTick);

  // Mint new position
  const tx = await positionManager.mint({
    token0,
    token1,
    fee: 3000, // 0.3%
    tickLower: nearestLowerTick,
    tickUpper: nearestUpperTick,
    amount0Desired: amount0,
    amount1Desired: amount1,
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
  });

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

  // Save position info
  const networkName = (await ethers.provider.getNetwork()).name || "local";
  await saveContractInfo(
    `LP_Position_${tokenId}`,
    {
      tokenId: tokenId.toString(),
      owner: signer.address,
      provider: ethers.provider,
    },
    networkName
  );
}

/*
npx hardhat run --network localhost scripts/local-deploy/05_addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
