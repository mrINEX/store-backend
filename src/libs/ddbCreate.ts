import * as clientDynamodb from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient";

const productsParams = {
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  TableName: "products",
  StreamSpecification: { StreamEnabled: false },
};

const stocksParams = {
  AttributeDefinitions: [{ AttributeName: "product_id", AttributeType: "S" }],
  KeySchema: [{ AttributeName: "product_id", KeyType: "HASH" }],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  TableName: "stocks",
  StreamSpecification: { StreamEnabled: false },
};

export const run = async () => {
  try {
    const tables = await ddbClient.send(
      new clientDynamodb.ListTablesCommand({})
    );
    console.log("tables", tables.TableNames);
    const productsExist = tables.TableNames.includes(productsParams.TableName);
    const stocksExist = tables.TableNames.includes(stocksParams.TableName);

    if (productsExist || stocksExist) {
      return;
    }

    const data = await Promise.all([
      ddbClient.send(new clientDynamodb.CreateTableCommand(productsParams)),
      ddbClient.send(new clientDynamodb.CreateTableCommand(stocksParams)),
    ]);

    for (const table of data) {
      const { TableArn: arn, TableName } = table.TableDescription;
      console.log(`Table ${TableName} created`, { arn });
    }
  } catch (err) {
    console.log("Error", err);
  }
};
run();
