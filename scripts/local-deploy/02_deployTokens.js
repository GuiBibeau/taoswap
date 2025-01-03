const { ethers } = require("hardhat");
const { updateEnvFile } = require("../utils/env");

const deployToken = async (contractName, owner) => {
  const Factory = await ethers.getContractFactory(contractName, owner);
  return Factory.deploy();
};

const mintTokens = async (token, owner, recipient, amount) => {
  await token
    .connect(owner)
    .mint(recipient.address, ethers.utils.parseEther(amount));
};

const deployAndMintTokens = async (owner, recipient) => {
  console.log("Deploying and minting tokens...");

  const tokens = {
    WTAO: await deployToken("WTAO", owner),
    UsdCoin: await deployToken("UsdCoin", owner),
  };

  console.log("Tokens deployed:");
  console.log("WTAO:", tokens.WTAO.address);
  console.log("USDC:", tokens.UsdCoin.address);

  // Mint USDC - reduced amount
  console.log("\nMinting USDC to recipient...");
  await mintTokens(tokens.UsdCoin, owner, recipient, "5000");

  // Log balances
  const usdcBalance = await tokens.UsdCoin.balanceOf(recipient.address);
  console.log("\nFinal balances:");
  console.log("USDC:", ethers.utils.formatEther(usdcBalance));

  return {
    WTAO_ADDRESS: tokens.WTAO.address,
    USDC_ADDRESS: tokens.UsdCoin.address,
  };
};

async function main() {
  const [owner, signer2] = await ethers.getSigners();
  console.log("Deploying with:", owner.address);
  console.log("Minting to:", signer2.address);

  const addresses = await deployAndMintTokens(owner, signer2);
  return updateEnvFile(addresses);
}

/*
  npx hardhat run --network localhost scripts/02_deployTokens.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
