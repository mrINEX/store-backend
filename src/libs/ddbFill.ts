import * as clientDynamodb from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient, ddbDocClient } from "./ddbClient";
import { Product, Stock, getProductService } from "./productService";

export const run = async () => {
  try {
    const tables = await ddbClient.send(
      new clientDynamodb.ListTablesCommand({})
    );
    console.log("tables", tables.TableNames);

    for (const table of tables.TableNames) {
      console.log("Table", table);

      const productService = getProductService();
      const products = await productService.getProducts();

      await Promise.all(
        products.map(async (product) => {
          await putItemProducts("products", product);
          await putItemStocks("stocks", {
            product_id: product.id,
            count: productService.getRandomInt(1, 50),
          });
        })
      );
    }
  } catch (err) {
    console.log("Error", err);
  }
};
run();

const putItemProducts = async (
  table: string,
  item: Omit<Product, "count" | "product_id">
) => {
  const params = {
    TableName: table,
    Item: {
      pk: table,
      sk: item.id,
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

const putItemStocks = async (table: string, item: Stock) => {
  const params = {
    TableName: table,
    Item: {
      pk: table,
      sk: item.product_id,
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
