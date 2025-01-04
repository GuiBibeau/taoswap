import { docClient } from "@/app/lib/dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { TokenInfo } from "./price-types";

const TABLE_NAME = "dex_tokens";

// Create/Update token
export async function storeToken(
  networkId: number,
  token: TokenInfo
): Promise<void> {
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

// Get token by network ID and symbol
export async function getToken(
  networkId: number,
  symbol: string
): Promise<TokenInfo | null> {
  try {
    const response = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          networkId,
          symbol,
        },
      })
    );

    return response.Item as TokenInfo | null;
  } catch (error) {
    console.error("Error getting token:", error);
    throw new Error("Failed to get token");
  }
}

// Get token by network ID and address using GSI
export async function getTokenByAddress(
  networkId: number,
  address: string
): Promise<TokenInfo | null> {
  try {
    const response = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "TokenAddressIndex",
        KeyConditionExpression: "networkId = :networkId AND address = :address",
        ExpressionAttributeValues: {
          ":networkId": networkId,
          ":address": address,
        },
      })
    );

    return (response.Items?.[0] as TokenInfo) || null;
  } catch (error) {
    console.error("Error getting token by address:", error);
    throw new Error("Failed to get token by address");
  }
}

// Get all tokens for a network
export async function getNetworkTokens(
  networkId: number
): Promise<TokenInfo[]> {
  try {
    const response = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "networkId = :networkId",
        ExpressionAttributeValues: {
          ":networkId": networkId,
        },
      })
    );

    return (response.Items as TokenInfo[]) || [];
  } catch (error) {
    console.error("Error getting network tokens:", error);
    throw new Error("Failed to get network tokens");
  }
}

// Update token attributes
export async function updateToken(
  networkId: number,
  symbol: string,
  updates: Partial<Omit<TokenInfo, "symbol">>
): Promise<void> {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<
      string,
      string | number | boolean | null
    > = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "symbol") {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    if (updateExpressions.length === 0) return;

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          networkId,
          symbol,
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
  } catch (error) {
    console.error("Error updating token:", error);
    throw new Error("Failed to update token");
  }
}

// Delete token
export async function deleteToken(
  networkId: number,
  symbol: string
): Promise<void> {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          networkId,
          symbol,
        },
      })
    );
  } catch (error) {
    console.error("Error deleting token:", error);
    throw new Error("Failed to delete token");
  }
}
