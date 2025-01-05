require("dotenv").config({
  path: ".env.local",
});

const { ethers } = require("hardhat");
const { createContract } = require("../utils/contracts");

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const removeLiquidity = async (signer) => {
  console.log("Removing liquidity...");

  const positionManager = createContract(
    process.env.POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    signer
  );

  // Get position count
  const balance = await positionManager.balanceOf(signer.address);
  console.log("Number of positions:", balance.toString());

  // Get all token IDs
  for (let i = 0; i < balance; i++) {
    const tokenId = await positionManager.tokenOfOwnerByIndex(
      signer.address,
      i
    );
    console.log("Found position with token ID:", tokenId.toString());

    // Get position information
    const position = await positionManager.positions(tokenId);
    console.log("Position liquidity:", position.liquidity.toString());

    if (position.liquidity.gt(0)) {
      console.log("Removing liquidity for token ID:", tokenId.toString());

      // Remove all liquidity
      const tx = await positionManager.decreaseLiquidity({
        tokenId: tokenId,
        liquidity: position.liquidity,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      });
      await tx.wait();
      console.log("Liquidity removed");

      // Collect fees and tokens
      const collectTx = await positionManager.collect({
        tokenId: tokenId,
        recipient: signer.address,
        amount0Max: ethers.constants.MaxUint256,
        amount1Max: ethers.constants.MaxUint256,
      });
      await collectTx.wait();
      console.log("Tokens collected");
    }
  }
};

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Removing liquidity with address:", signer.address);

  await removeLiquidity(signer);
}

/*
npx hardhat run --network localhost scripts/local-deploy/05b_removeLiquidity.js
npx hardhat run --network bittensorTestnet scripts/local-deploy/05b_removeLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
