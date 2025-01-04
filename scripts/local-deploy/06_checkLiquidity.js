require("dotenv").config({
  path: ".env.local",
});
const { createContract, getPoolData } = require("../utils/contracts");
const UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");

WTAO_USDC_3000 = process.env.WTAO_USDC_3000;

const main = async () => {
  const provider = ethers.provider;
  const poolContract = createContract(
    WTAO_USDC_3000,
    UniswapV3Pool.abi,
    provider
  );
  const poolData = await getPoolData(poolContract);
  console.log("Pool Data for WTAO/USDC:");
  console.log("Fee:", poolData.fee.toString());
  console.log("Liquidity:", poolData.liquidity.toString());
  console.log("Current Tick:", poolData.tick);
  console.log("Tick Spacing:", poolData.tickSpacing.toString());
  console.log("SqrtPriceX96:", poolData.sqrtPriceX96.toString());
};

/*
npx hardhat run --network localhost scripts/local-deploy/06_checkLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
