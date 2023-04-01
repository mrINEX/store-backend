import { ValidatedAPIGatewayProxyEvent } from "libs/api-gateway";
import { Callback, Context } from "aws-lambda";
import { getProduct } from "./handler";
import { NotFound } from "http-errors";

const mock = {
  success: {
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
  },
  product: {
    id: "1",
    title: "rew",
    description: "jet",
    price: 33,
    image: "http//sd",
  },
};

jest.mock("libs/productService", () => {
  return {
    getProductService: () => ({
      getProducts: () => [mock.product],
    }),
  };
});

describe("getProduct", () => {
  test("should return product by id", async () => {
    const event = {
      pathParameters: { id: "1" },
    } as unknown as ValidatedAPIGatewayProxyEvent<undefined>;
    const context = <Context>{};
    const callback: Callback = () => {};

    const response = await getProduct(event, context, callback);
    expect(response).toMatchObject({
      ...mock.success,
      body: JSON.stringify({ data: mock.product, message: "product" }),
    });
  });

  test("should throw error product by id not found", async () => {
    const event = {
      pathParameters: { id: "999999999" },
    } as unknown as ValidatedAPIGatewayProxyEvent<undefined>;
    const context = <Context>{};
    const callback: Callback = () => {};

    await expect(getProduct(event, context, callback)).rejects.toThrowError(
      NotFound
    );
  });
});
