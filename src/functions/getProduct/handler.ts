import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { mockProducts } from "../../common/products.mock";

const getProducts: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  const product = mockProducts.find(
    (product) => product.id === event.pathParameters.id
  );

  return formatJSONResponse({
    data: product,
    message: `Products`,
    event,
  });
};

export const main = middyfy(getProducts);
