import { S3Handler } from "aws-lambda";
import { middyfy } from "../../libs/lambda";
import {
  CopyObject,
  deleteObject,
  getObject,
  parsedKey,
} from "../../libs/importService";
import { clientS3WithoutCredentials as client } from "../../libs/ddbClient";
import csv from "csv-parser";
import { Transform } from "stream";

export const importFileParser: S3Handler = async (event) => {
  const [Record] = event.Records;
  const { s3 } = Record;

  const item = await getObject(client, {
    bucket: s3.bucket.name,
    key: s3.object.key,
  });

  const results = [];

  console.log("cwd", process.cwd());
  console.log("dirname", __dirname);

  (item.Body as NodeJS.ReadableStream)
    // .pipe(
    //   new Transform({
    //     transform(chunk, encoding, callback) {
    //       console.log("chunk before csv parse:", chunk.toString());
    //       callback(null, chunk);
    //     },
    //   })
    // )
    .pipe(csv({ separator: ";" }))
    // .pipe(
    //   new Transform({
    //     transform(chunk, encoding, callback) {
    //       console.log("chunk after csv parse:", chunk);
    //       callback(null, chunk);
    //     },
    //   })
    // )
    .on("data", (data) => {
      results.push(data);
      console.log("data", data);
    })
    .on("finish", async () => {
      console.log("finish event");

      await CopyObject(client, {
        source: parsedKey,
        bucket: s3.bucket.name,
        key: s3.object.key,
      });
      console.log("finish event copied");

      await deleteObject(client, {
        bucket: s3.bucket.name,
        key: s3.object.key,
      });
      console.log("finish event deleted", s3.bucket.name, s3.object.key);
    })
    .on("end", () => {
      console.log("end event");
      console.log("results", results);
    })
    .on("error", (...error) => console.log("error", error));
};

export const main = middyfy(importFileParser, false);
