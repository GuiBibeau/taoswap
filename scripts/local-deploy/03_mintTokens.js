const { ethers } = require("hardhat");
const { mintTokens } = require("../utils/mintTokens");

async function main() {
  const [owner] = await ethers.getSigners();

  // Get contract addresses from environment
  const wtaoAddress = process.env.WTAO_ADDRESS;
  const usdcAddress = process.env.USDC_ADDRESS;

  if (!wtaoAddress || !usdcAddress) {
    throw new Error("Missing contract addresses in environment variables");
  }

  console.log("Minting tokens...");
  console.log("WTAO address:", wtaoAddress);
  console.log("USDC address:", usdcAddress);

  // Get contract instances
  const wtao = await ethers.getContractAt("WTAO", wtaoAddress);
  const usdc = await ethers.getContractAt("UsdCoin", usdcAddress);

  // Mint 1 WTAO (using deposit since WTAO is a wrapped token)
  console.log("\nMinting 1 WTAO...");
  const wtaoAmount = ethers.utils.parseEther("1");
  await wtao.connect(owner).deposit({ value: wtaoAmount });

  // Mint 500 USDC
  console.log("Minting 500 USDC...");
  const usdcAmount = "500";
  await mintTokens(usdc, owner, owner, usdcAmount);

  // Log final balances
  const wtaoBalance = await wtao.balanceOf(owner.address);
  const usdcBalance = await usdc.balanceOf(owner.address);

  console.log("\nFinal balances:");
  console.log("WTAO:", ethers.utils.formatEther(wtaoBalance));
  console.log("USDC:", ethers.utils.formatEther(usdcBalance));
}

/*
npx hardhat run --network localhost scripts/local-deploy/03_mintTokens.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
