require("dotenv").config({
  path: ".env.local",
});
const { createContract, getPoolData } = require("./utils/contracts");
const UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");

USDT_USDC_500 = process.env.USDT_USDC_500;

const main = async () => {
  const provider = ethers.provider;
  const poolContract = createContract(
    USDT_USDC_500,
    UniswapV3Pool.abi,
    provider
  );
  const poolData = await getPoolData(poolContract);
  console.log("poolData", poolData);
};

/*
  npx hardhat run --network localhost scripts/05_checkLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
