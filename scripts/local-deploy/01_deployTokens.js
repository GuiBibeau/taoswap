const { ethers } = require("hardhat");
const { updateEnvFile } = require("../utils/env");

const deployToken = async (contractName, owner) => {
  const Factory = await ethers.getContractFactory(contractName, owner);
  return Factory.deploy();
};

const deployTokens = async (owner) => {
  console.log("Deploying tokens...");

  const tokens = {
    WTAO: await deployToken("WTAO", owner),
    UsdCoin: await deployToken("UsdCoin", owner),
  };

  console.log("Tokens deployed:");
  console.log("WTAO:", tokens.WTAO.address);
  console.log("USDC:", tokens.UsdCoin.address);

  return {
    WTAO_ADDRESS: tokens.WTAO.address,
    USDC_ADDRESS: tokens.UsdCoin.address,
  };
};

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying with:", owner.address);

  const addresses = await deployTokens(owner);
  await updateEnvFile(addresses);
  return addresses;
}

/*
npx hardhat run --network localhost scripts/local-deploy/01_deployTokens.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
