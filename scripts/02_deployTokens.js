const fs = require("fs");
const { promisify } = require("util");
const { updateEnvFile } = require("./utils/env");

async function main() {
  const [owner, signer2] = await ethers.getSigners();

  Tether = await ethers.getContractFactory("Tether", owner);
  tether = await Tether.deploy();

  Usdc = await ethers.getContractFactory("UsdCoin", owner);
  usdc = await Usdc.deploy();

  WrappedBitcoin = await ethers.getContractFactory("WrappedBitcoin", owner);
  wrappedBitcoin = await WrappedBitcoin.deploy();

  await tether
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("100000"));
  await usdc
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("100000"));
  await wrappedBitcoin
    .connect(owner)
    .mint(signer2.address, ethers.utils.parseEther("100000"));

  let addresses = {
    USDC_ADDRESS: usdc.address,
    TETHER_ADDRESS: tether.address,
    WRAPPED_BITCOIN_ADDRESS: wrappedBitcoin.address,
  };

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
