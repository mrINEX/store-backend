import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { mockProducts } from "./products.mock";

import schema from "./schema";

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  return formatJSONResponse({
    data: mockProducts,
    message: `Products`,
    event,
  });
};

export const main = middyfy(getProducts);
