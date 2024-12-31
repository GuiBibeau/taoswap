require("dotenv").config({
  path: ".env.local",
});
USDT_USDC_500 = process.env.USDT_USDC_500;

const { Contract } = require("ethers");
const UniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity.toString(),
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

async function main() {
  const provider = ethers.provider;

  const poolContract = new Contract(USDT_USDC_500, UniswapV3Pool.abi, provider);

  const poolData = await getPoolData(poolContract);
  console.log("poolData", poolData);
}

/*
  npx hardhat run --network localhost scripts/05_checkLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
