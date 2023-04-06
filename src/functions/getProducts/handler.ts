import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import { getDdbProductService } from "../../libs/productService";
import schema from "./schema";

const productService = getDdbProductService(
  docClient,
  process.env.PRODUCTS_TABLE
);

export const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const products = await productService.getProducts();
  return formatJSONResponse({
    data: products,
    message: `products`,
  });
};

export const main = middyfy(getProducts);
