import {
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";
import { client } from "./index";

async function tableExists(tableName: string): Promise<boolean> {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return false;
    }
    throw error;
  }
}

export async function createPriceTable() {
  if (await tableExists("token_prices")) {
    console.log("Price table already exists");
    return;
  }

  const command = new CreateTableCommand({
    TableName: "token_prices",
    KeySchema: [
      { AttributeName: "assetId", KeyType: "HASH" },
      { AttributeName: "timestamp", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "assetId", AttributeType: "S" },
      { AttributeName: "timestamp", AttributeType: "N" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    await client.send(command);
    console.log("Table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

export async function createTokenTable() {
  if (await tableExists("dex_tokens")) {
    console.log("Token table already exists");
    return;
  }

  const command = new CreateTableCommand({
    TableName: "dex_tokens",
    KeySchema: [
      { AttributeName: "networkId", KeyType: "HASH" },
      { AttributeName: "symbol", KeyType: "RANGE" },
    ],
    AttributeDefinitions: [
      { AttributeName: "networkId", AttributeType: "N" },
      { AttributeName: "symbol", AttributeType: "S" },
      { AttributeName: "address", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "TokenAddressIndex",
        KeySchema: [
          { AttributeName: "networkId", KeyType: "HASH" },
          { AttributeName: "address", KeyType: "RANGE" },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    await client.send(command);
    console.log("Token table created successfully");
  } catch (error) {
    console.error("Error creating token table:", error);
    throw error;
  }
}
