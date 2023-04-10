import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { REGION, PROFILE } from "./constants";

export const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});

export const client = new DynamoDBClient({
  region: REGION,
});

export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
export const docClient = DynamoDBDocumentClient.from(client);
