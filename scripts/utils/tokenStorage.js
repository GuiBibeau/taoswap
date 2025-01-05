require("dotenv").config({
  path: ".env.local",
});

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "dex_tokens";

async function storeToken(networkId, token) {
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          networkId,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          address: token.address,
          logoURI: token.logoURI,
        },
      })
    );
  } catch (error) {
    console.error("Error storing token:", error);
    throw new Error("Failed to store token");
  }
}

module.exports = {
  storeToken,
};
