import { Callback, Context, S3Event } from "aws-lambda";
import { importFileParser } from "./handler";
import { createReadStream } from "fs";
import path from "path";

const mock = {
  success: {
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: 200,
  },
};

jest.mock("../../libs/importService", () => {
  return {
    copyObject: jest.fn().mockResolvedValue({}),
    deleteObject: jest.fn().mockResolvedValue({}),
    getObject: () =>
      Promise.resolve({
        Body: createReadStream(path.join(__dirname, "./test.csv")),
      }),
    parsedKey: "parsed/",
  };
});

describe("importFileParser", () => {
  test("should return product by id", async () => {
    const event = {
      Records: [{ s3: { bucket: { name: "name" }, object: { key: "key" } } }],
    } as S3Event;
    const context = <Context>{};
    const callback: Callback = () => {};

    const response = await importFileParser(event, context, callback);
    expect(response).toBeUndefined();
  });
});
