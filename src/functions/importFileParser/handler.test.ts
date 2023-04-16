import { Callback, Context, S3Event } from "aws-lambda";
import { importFileParser } from "./handler";

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

jest.mock("../../libs/productService", () => {
  return {
    getProductService: () => ({
      getProducts: () => [mock.product],
    }),
  };
});

describe("getProduct", () => {
  test("should return product by id", async () => {
    const event = {} as S3Event;
    const context = <Context>{};
    const callback: Callback = () => {};

    const response = await importFileParser(event, context, callback);
    expect(response).toMatchObject({
      ...mock.success,
      body: JSON.stringify({ data: mock.product, message: "product" }),
    });
  });
});
