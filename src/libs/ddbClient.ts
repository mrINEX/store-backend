import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import { REGION, PROFILE } from "./constants";

export const ddbClient = new DynamoDBClient({
  region: REGION,
  credentials: fromIni({ profile: PROFILE }),
});
