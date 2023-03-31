import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { mockProducts } from "../../common/products.mock";
import { NotFound } from "http-errors";

const getProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const products = await mockProducts;
  const product = products.find(
    (product) => product.id === event.pathParameters.id
  );

  if (product == null) {
    throw new NotFound("Product not found");
  }

  return formatJSONResponse({
    data: product,
    message: `product`,
  });
};

export const main = middyfy(getProduct);
