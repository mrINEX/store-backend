import type { ValidatedEventAPIGatewayProxyEvent } from "libs/api-gateway";
import { formatJSONResponse } from "libs/api-gateway";
import { middyfy } from "libs/lambda";
import { getProductService } from "libs/productService";

import schema from "./schema";
const productService = getProductService();

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const products = await productService.getProducts();
  return formatJSONResponse({
    data: products,
    message: `products`,
  });
};

export const main = middyfy(getProducts);
