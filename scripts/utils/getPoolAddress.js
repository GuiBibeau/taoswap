require("dotenv").config({
  path: ".env.local",
});
const { ethers } = require("hardhat");
const { createContract } = require("./contracts");

// Reference to factory ABI from your existing code
const UniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");

// Helper function from your existing code
const sortTokens = (tokenA, tokenB) => {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
};

async function getPoolAddress(tokenA, tokenB, fee = 3000) {
  const [signer] = await ethers.getSigners();

  // Create factory contract instance
  const factory = createContract(
    process.env.FACTORY_ADDRESS,
    UniswapV3Factory.abi,
    signer
  );

  // Sort tokens (required by Uniswap)
  const [token0, token1] = sortTokens(tokenA, tokenB);

  // Get pool address
  const poolAddress = await factory.getPool(token0, token1, fee);

  console.log("\nPool Details:");
  console.log("Token A:", tokenA);
  console.log("Token B:", tokenB);
  console.log("Fee Tier:", fee);
  console.log("Pool Address:", poolAddress);

  return poolAddress;
}

// Handle command line arguments
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("Usage: node getPoolAddress.js <tokenA> <tokenB> [feeTier]");
    console.error("Example: node getPoolAddress.js 0x... 0x... 3000");
    process.exit(1);
  }

  const [tokenA, tokenB, fee = 3000] = args;
  await getPoolAddress(tokenA, tokenB, parseInt(fee));
}

/*
Usage examples:
npx hardhat run --network localhost scripts/utils/getPoolAddress.js 0x... 0x...
npx hardhat run --network bittensorTestnet scripts/utils/getPoolAddress.js 0x... 0x...
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
