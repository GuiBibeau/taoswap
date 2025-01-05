const { formatUnits } = require("viem");

const calculatePrice = (sqrtPriceX96) => {
  // Convert string to BigInt
  const sqrtPriceX96BigInt = BigInt(sqrtPriceX96);

  // Calculate price from sqrtPrice
  // price = (sqrtPrice/2^96)^2
  const Q96 = BigInt(2) ** BigInt(96);

  // Multiply first to maintain precision
  const numerator = sqrtPriceX96BigInt * sqrtPriceX96BigInt;
  const denominator = Q96 * Q96;

  // Convert to number with high precision
  const price = Number(numerator) / Number(denominator);

  return {
    rawPrice: price.toString(),
    usdcPerTao: price,
    taoPerUsdc: 1 / price,
  };
};

// Your sqrtPriceX96 from the pool
const sqrtPriceX96 = "3543191142285914205922034323";
const price = calculatePrice(sqrtPriceX96);

console.log("Price calculation:");
console.log("SqrtPriceX96:", sqrtPriceX96);
console.log("Raw price:", price.rawPrice);
console.log("USDC per TAO:", price.usdcPerTao.toFixed(6));
console.log("TAO per USDC:", price.taoPerUsdc.toFixed(6));
