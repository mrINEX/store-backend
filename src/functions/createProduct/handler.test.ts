import { ValidatedAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { Callback, Context } from "aws-lambda";
import { createProduct } from "./handler";
import schema from "./schema";

const mock = {
  success: {
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
  },
  product: {},
};

jest.mock("../../libs/productService", () => {
  return {
    getProductService: () => ({
      getProducts: () => [mock.product],
    }),
  };
});

describe("getProduct", () => {
  test("should return product by id", async () => {
    const event = { body: null } as unknown as ValidatedAPIGatewayProxyEvent<
      typeof schema
    >;
    const context = <Context>{};
    const callback: Callback = () => {};

    mock.product = {
      id: "1",
      title: "rew",
      description: "jet",
      price: 33,
      image: "http//sd",
    };

    const response = await createProduct(event, context, callback);
    expect(response).toMatchObject({
      ...mock.success,
      body: JSON.stringify({ data: [mock.product], message: "products" }),
    });
  });
});
