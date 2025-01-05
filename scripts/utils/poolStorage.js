require("dotenv").config({
  path: ".env.local",
});
const { ethers } = require("hardhat");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "dex_pools";

// Get token symbols helper
async function getTokenSymbols(token0Address, token1Address, signer) {
  const token0 = new ethers.Contract(
    token0Address,
    ["function symbol() view returns (string)"],
    signer
  );
  const token1 = new ethers.Contract(
    token1Address,
    ["function symbol() view returns (string)"],
    signer
  );

  const [symbol0, symbol1] = await Promise.all([
    token0.symbol(),
    token1.symbol(),
  ]);

  return { symbol0, symbol1 };
}

async function storeExistingPool() {
  try {
    const [signer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const networkId = network.chainId;

    // Get pool address from env
    const poolAddress = process.env.WTAO_USDC_3000;
    if (!poolAddress) {
      throw new Error("Pool address not found in environment variables");
    }

    console.log(
      `Storing pool information for network ${network.name} (${networkId})`
    );
    console.log("Pool address:", poolAddress);

    // Create pool contract instance
    const poolContract = new ethers.Contract(
      poolAddress,
      [
        "function token0() view returns (address)",
        "function token1() view returns (address)",
        "function fee() view returns (uint24)",
        "function tickSpacing() view returns (int24)",
      ],
      signer
    );

    // Get pool data
    const [token0Address, token1Address, fee, tickSpacing] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
    ]);

    // Get token symbols
    const { symbol0, symbol1 } = await getTokenSymbols(
      token0Address,
      token1Address,
      signer
    );

    // Store in DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          networkId,
          address: poolAddress,
          token0Address,
          token1Address,
          token0Symbol: symbol0,
          token1Symbol: symbol1,
          fee: Number(fee),
          tickSpacing: Number(tickSpacing),
          createdAt: Date.now(),
        },
      })
    );

    console.log("Successfully stored pool information:");
    console.log({
      networkId,
      address: poolAddress,
      token0Symbol: symbol0,
      token1Symbol: symbol1,
      fee: Number(fee),
      tickSpacing: Number(tickSpacing),
    });
  } catch (error) {
    console.error("Error storing pool:", error);
    throw error;
  }
}

/*
npx hardhat run --network localhost scripts/utils/poolStorage.js
npx hardhat run --network bittensorTestnet scripts/utils/poolStorage.js 
*/

storeExistingPool()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
