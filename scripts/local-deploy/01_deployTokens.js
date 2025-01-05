const { ethers } = require("hardhat");
const { updateEnvFile } = require("../utils/env");
const { storeToken } = require("../utils/tokenStorage");

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

  // Store token information in DynamoDB
  const chainId = (await ethers.provider.getNetwork()).chainId;

  // Only store tokens if we're on testnet chains
  if (chainId === 945 || chainId === 964) {
    console.log(`Storing token information for chain ${chainId}...`);

    // Store WTAO
    await storeToken(chainId, {
      symbol: "WTAO",
      name: "Wrapped TAO",
      decimals: 18,
      address: tokens.WTAO.address,
      logoURI:
        "https://raw.githubusercontent.com/opentensor/assets/main/wtao.png",
    });

    // Store USDC
    await storeToken(chainId, {
      symbol: "USDC",
      name: "USD Coin",
      decimals: 18,
      address: tokens.UsdCoin.address,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    });

    console.log("Token information stored in DynamoDB");
  }

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
npx hardhat run --network bittensorTestnet scripts/local-deploy/01_deployTokens.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
