const { ethers } = require("hardhat");

const mintTokens = async (token, owner, recipient, amount) => {
  await token
    .connect(owner)
    .mint(recipient.address, ethers.utils.parseEther(amount));
};

async function main() {
  // Get command line arguments (skip first two: node and script path)
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: script.js <token-address> [amount]");
    console.error("  token-address: The address of the token contract");
    console.error("  amount: Amount to mint (default: 5000)");
    process.exit(1);
  }

  const [tokenAddress, amount = "5000"] = args;
  const [owner, recipient] = await ethers.getSigners();

  console.log("Minting tokens...");
  console.log("Token address:", tokenAddress);
  console.log("Owner:", owner.address);
  console.log("Recipient:", recipient.address);
  console.log("Amount:", amount);

  // Get the token contract
  const token = await ethers.getContractAt("ERC20", tokenAddress, owner);

  // Mint tokens
  await mintTokens(token, owner, recipient, amount);

  // Log final balance
  const balance = await token.balanceOf(recipient.address);
  console.log("\nFinal balance:", ethers.utils.formatEther(balance));
}

/*
Usage: 
npx hardhat run --network localhost scripts/utils/mintTokens.js <token-address> [amount]
*/

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  mintTokens,
};
