import { ValidatedAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { Callback, Context } from "aws-lambda";
import { catalogBatchProcess } from "./handler";

const mock = {
  success: {
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
  },
  output: { signedUrl: "https://" },
};

jest.mock("../../libs/importService", () => {
  return {
    generatePutSignedUrl: () => Promise.resolve(mock.output.signedUrl),
  };
});

describe("catalogBatchProcess", () => {
  test("should return signed url", async () => {
    const event = {
      queryStringParameters: { name: "fileName" },
    } as unknown as ValidatedAPIGatewayProxyEvent<undefined>;
    const context = <Context>{};
    const callback: Callback = () => {};

    const response = await catalogBatchProcess(event, context, callback);
    expect(response).toMatchObject({
      ...mock.success,
      body: JSON.stringify({ data: mock.output, message: "signed url" }),
    });
  });
});
