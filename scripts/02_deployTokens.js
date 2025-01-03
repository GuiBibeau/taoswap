const { updateEnvFile } = require("./utils/env");

const deployToken = async (contractName, owner) => {
  const Factory = await ethers.getContractFactory(contractName, owner);
  return Factory.deploy();
};

const mintTokens = async (token, owner, recipient, amount) => {
  await token.connect(owner).mint(recipient, ethers.utils.parseEther(amount));
};

const deployAndMintTokens = async (owner, recipient) => {
  const tokens = {
    Tether: await deployToken("Tether", owner),
    UsdCoin: await deployToken("UsdCoin", owner),
    WrappedBitcoin: await deployToken("WrappedBitcoin", owner),
  };

  for (const token of Object.values(tokens)) {
    await mintTokens(token, owner, recipient, "100000");
  }

  return {
    USDC_ADDRESS: tokens.UsdCoin.address,
    TETHER_ADDRESS: tokens.Tether.address,
    WRAPPED_BITCOIN_ADDRESS: tokens.WrappedBitcoin.address,
  };
};

async function main() {
  const [owner, signer2] = await ethers.getSigners();
  const addresses = await deployAndMintTokens(owner, signer2.address);
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
