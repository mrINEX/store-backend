import * as clientDynamodb from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ddbClient";
import { Product, getProductService } from "./productService";

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
      for (const table of tables.TableNames) {
        console.log("Table", table);

        if (table === productsParams.TableName) {
          const productService = getProductService();
          const products = await productService.getProducts();

          await Promise.all(products.map((product) => putItem(table, product)));
        }
      }
      return;
    }

    const data = await Promise.all([
      ddbClient.send(new clientDynamodb.CreateTableCommand(productsParams)),
      ddbClient.send(new clientDynamodb.CreateTableCommand(stocksParams)),
    ]);

    for (const table of data) {
      const { TableArn: arn, TableName } = table.TableDescription;
      console.log(`Table ${TableName} created`, { arn });

      if (TableName === productsParams.TableName) {
        const productService = getProductService();
        const products = await productService.getProducts();

        await Promise.all(
          products.map((product) => putItem(TableName, product))
        );
      }
    }
  } catch (err) {
    console.log("Error", err);
  }
};
run();

const putItem = async (table: string, item: Product) => {
  const params = {
    TableName: table,
    Item: {
      primaryKey: item.id,
      ...item,
    },
  };
  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }
};
