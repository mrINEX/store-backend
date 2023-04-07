import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import {
  getDdbProductService,
  getDdbStockService,
} from "../../libs/productService";
import schema from "./schema";

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

const productService = getDdbProductService(docClient, PRODUCTS_TABLE);
const stockService = getDdbStockService(docClient, STOCKS_TABLE);

export const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const [products, stocks] = await Promise.all([
    productService.getProducts(),
    stockService.getStocks(),
  ]);
  productService.merge(products, stocks);

  return formatJSONResponse({
    data: products,
    message: `products`,
  });
};

export const main = middyfy(getProducts);
