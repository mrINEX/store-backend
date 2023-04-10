import { v4 as uuidv4 } from "uuid";
import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import { getDdbTransactProductService } from "../../libs/productService";
import schema from "./schema";

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

// const productService = getDdbProductService(docClient, PRODUCTS_TABLE);
// const stockService = getDdbStockService(docClient, STOCKS_TABLE);
const transactService = getDdbTransactProductService(docClient, {
  stock: STOCKS_TABLE,
  product: PRODUCTS_TABLE,
});

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { count, ...product } = event.body;
  const uuid = uuidv4();

  const result = await transactService.putTransact({
    itemProduct: { ...product, id: uuid },
    itemStock: { count, product_id: uuid },
  });
  // await Promise.all([
  //   productService.putProduct({ ...product, id: uuid }),
  //   stockService.putStock({ count, product_id: uuid }),
  // ]);

  return formatJSONResponse({
    data: result,
    message: `product`,
  });
};

export const main = middyfy(createProduct);
