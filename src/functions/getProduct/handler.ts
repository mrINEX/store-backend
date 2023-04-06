import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { docClient } from "../../libs/ddbClient";
import { middyfy } from "../../libs/lambda";
import { getDdbProductService } from "../../libs/productService";
import { NotFound } from "http-errors";

const productService = getDdbProductService(
  docClient,
  process.env.PRODUCTS_TABLE
);

export const getProduct: ValidatedEventAPIGatewayProxyEvent<undefined> = async (
  event
) => {
  const product = await productService.getProduct(event.pathParameters.id);

  if (product == null) {
    throw new NotFound("Product not found");
  }

  return formatJSONResponse({
    data: product,
    message: `product`,
  });
};

export const main = middyfy(getProduct);
