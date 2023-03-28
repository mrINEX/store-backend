import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { mockProducts } from "../../common/products.mock";

import schema from "./schema";

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  const products = await mockProducts;
  return formatJSONResponse({
    data: products,
    message: `products`,
  });
};

export const main = middyfy(getProducts);
