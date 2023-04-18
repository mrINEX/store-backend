import { S3Handler } from "aws-lambda";
import { middyfy } from "../../libs/lambda";
import {
  copyObject,
  deleteObject,
  getObject,
  parsedKey,
  send,
} from "../../libs/importService";
import {
  clientS3WithoutCredentials as client,
  clientSQSWithoutCredentials as sqsClient,
} from "../../libs/ddbClient";
import csv from "csv-parser";
import { Writable } from "stream";

export const importFileParser: S3Handler = async (event) => {
  const [Record] = event.Records;
  const { s3 } = Record;

  const item = await getObject(client, {
    bucket: s3.bucket.name,
    key: s3.object.key,
  });

  (item.Body as NodeJS.ReadableStream).pipe(csv({ separator: ";" })).pipe(
    new Writable({
      objectMode: true,
      write(chunk, _encoding, callback) {
        console.log("parsed product", chunk);
        send(sqsClient, JSON.stringify(chunk));
        callback();
      },
    })
  );

  await copyObject(client, {
    source: `${s3.bucket.name}/${s3.object.key}`,
    bucket: s3.bucket.name,
    key: `${parsedKey}${Date.now()}.csv`,
  });

  await deleteObject(client, {
    bucket: s3.bucket.name,
    key: s3.object.key,
  });
};

export const main = middyfy(importFileParser, false);
