require("dotenv").config({
  path: ".env.local",
});

const { createContract } = require("./utils/contracts");

const artifacts = {
  Tether: require("../artifacts/contracts/Tether.sol/Tether.json"),
  UsdCoin: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
  WrappedBitcoin: require("../artifacts/contracts/WrappedBitcoin.sol/WrappedBitcoin.json"),
};

const TOKENS = {
  USDT: {
    address: process.env.TETHER_ADDRESS,
    artifact: artifacts.Tether,
  },
  USDC: {
    address: process.env.USDC_ADDRESS,
    artifact: artifacts.UsdCoin,
  },
  WBTC: {
    address: process.env.WRAPPED_BITCOIN_ADDRESS,
    artifact: artifacts.WrappedBitcoin,
  },
};

async function mintTokens(recipientAddress, amount) {
  const [owner] = await ethers.getSigners();
  const provider = ethers.provider;

  for (const [symbol, token] of Object.entries(TOKENS)) {
    const tokenContract = createContract(
      token.address,
      token.artifact.abi,
      provider
    );

    console.log(`Minting ${amount} ${symbol} to ${recipientAddress}...`);

    try {
      const tx = await tokenContract
        .connect(owner)
        .mint(recipientAddress, ethers.utils.parseEther(amount));
      await tx.wait();
      console.log(`Successfully minted ${amount} ${symbol}`);
    } catch (error) {
      console.error(`Error minting ${symbol}:`, error);
    }
  }
}

async function main() {
  // Replace with the recipient address and amount you want to mint
  const recipientAddress = "0x..."; // Add the recipient address here
  const amount = "1000"; // Amount of tokens to mint

  await mintTokens(recipientAddress, amount);
}

/*
    Usage: npx hardhat run --network localhost scripts/mintTokens.js
  */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
