import { ValidatedAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { Callback, Context } from "aws-lambda";
import { basicAuthorizer } from "./handler";

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
    getDdbTransactProductService: () => ({
      putTransact: () => [],
    }),
  };
});

describe("basicAuthorizer", () => {
  test("should return product by id", async () => {
    const event = {} as ValidatedAPIGatewayProxyEvent<undefined>;
    const context = <Context>{};
    const callback: Callback = () => {};

    mock.product = {
      id: "1",
      title: "rew",
      description: "jet",
      price: 33,
      image: "http//sd",
    };

    const response = await basicAuthorizer(event, context, callback);
    expect(response).toMatchObject({
      ...mock.success,
      body: JSON.stringify({ data: [], message: "products" }),
    });
  });
});
