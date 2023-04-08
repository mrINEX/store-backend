import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import {
  getDdbProductService,
  getDdbStockService,
} from "../../libs/productService";
import { NotFound } from "http-errors";

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

const productService = getDdbProductService(docClient, PRODUCTS_TABLE);
const stockService = getDdbStockService(docClient, STOCKS_TABLE);

export const getProduct: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  const [product, stock] = await Promise.all([
    productService.getProduct(event.pathParameters.id),
    stockService.getStock(event.pathParameters.id),
  ]);

  if (product == null) {
    throw NotFound("Product not found");
  }

  return formatJSONResponse({
    data: { ...product, count: stock.count },
    message: `product`,
  });
};

export const main = middyfy(getProduct);
