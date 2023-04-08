import { v4 as uuidv4 } from "uuid";
import httpError from "http-errors";
import { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
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

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { count, ...product } = event.body;
    const uuid = uuidv4();

    await Promise.all([
      productService.putProduct({ ...product, id: uuid }),
      stockService.putStock({ count, product_id: uuid }),
    ]);

    return formatJSONResponse({
      data: product,
      message: `product`,
    });
  } catch (err) {
    throw httpError(500, "Server error", { expose: true });
  }
};

export const main = middyfy(createProduct);
