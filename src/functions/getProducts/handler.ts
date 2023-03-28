import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { mockProducts } from "../../common/products.mock";

import schema from "./schema";

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  return formatJSONResponse({
    data: mockProducts,
    message: `products`,
  });
};

export const main = middyfy(getProducts);
