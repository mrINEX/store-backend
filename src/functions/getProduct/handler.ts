import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import {
  getDdbProductService,
  getDdbStockService,
} from "../../libs/productService";
import httpError from "http-errors";

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const STOCKS_TABLE = process.env.STOCKS_TABLE;

const productService = getDdbProductService(docClient, PRODUCTS_TABLE);
const stockService = getDdbStockService(docClient, STOCKS_TABLE);

export const getProduct: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  try {
    const [product, stock] = await Promise.all([
      productService.getProduct(event.pathParameters.id),
      stockService.getStock(event.pathParameters.id),
    ]);

    if (product == null) {
      throw httpError(404, "Product not found", { expose: true });
    }

    return formatJSONResponse({
      data: { ...product, count: stock.count },
      message: `product`,
    });
  } catch (err) {
    throw httpError(500, "Server error", { expose: true });
  }
};

export const main = middyfy(getProduct);
