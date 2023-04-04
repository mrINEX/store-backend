import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient";

// Set the parameters
export const params = {
  AttributeDefinitions: [
    { AttributeName: "Id", AttributeType: "S" },
    { AttributeName: "Title", AttributeType: "S" },
  ],
  KeySchema: [
    { AttributeName: "Id", KeyType: "HASH" },
    { AttributeName: "Title", KeyType: "RANGE" },
  ],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  TableName: "Products",
  StreamSpecification: { StreamEnabled: false },
};

export const run = async () => {
  try {
    const data = await ddbClient.send(new CreateTableCommand(params));
    console.log("Table Created", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
run();
