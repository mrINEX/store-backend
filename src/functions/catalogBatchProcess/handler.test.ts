import { Callback, Context, SQSEvent } from "aws-lambda";
import { catalogBatchProcess } from "./handler";
import { publish } from "../../libs/importService";

jest.mock("../../libs/importService");
jest.mock("../../libs/productService", () => {
  const putBatchTransact = jest.fn().mockResolvedValue({});
  return {
    getDdbTransactProductService: () => ({
      putBatchTransact,
    }),
  };
});

describe("catalogBatchProcess", () => {
  beforeAll(() => {
    const publish = jest.fn().mockResolvedValue({});
    (publish as jest.Mock).mockImplementation(() => {
      return { publish };
    });
  });
  test("should publish message", async () => {
    const event = {
      Records: [{ body: JSON.stringify({ count: 2, title: "Cat" }) }],
    } as SQSEvent;
    const context = <Context>{};
    const callback: Callback = () => {};

    const response = await catalogBatchProcess(event, context, callback);
    expect(response).toBeUndefined();
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
