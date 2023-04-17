import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./ddbClient";
import { createReadStream } from "fs";
const { pipeline } = require("node:stream/promises");
import csv from "csv-parser";
import path from "path";
import { Writable } from "stream";

export const bucket = "integration-with-s3";
export const key = "uploaded/";
export const parsedKey = "parsed/";

async function run() {
  switch (process.argv[2]) {
    case "--create":
      await create();
      return;
    case "--copy":
      await copy();
      return;
    case "--test":
      await (async function name() {
        await pipeline(
          createReadStream(
            path.join(process.cwd(), "src/functions/importFileParser/test.csv")
          ),
          csv({ separator: ";" }),
          new Writable({
            objectMode: true,
            write(chunk, _encoding, callback) {
              console.log("parsed product", chunk);
              callback();
            },
          })
        );
      })();
      console.log("pipeline finished");
      return;
    default:
      console.log(`${process.argv[2]} does not support`);
  }
}

const create = async () => {
  try {
    const { Buckets } = await s3Client.send(new ListBucketsCommand({}));

    for (const Bucket of Buckets) {
      if (Bucket.Name === bucket) {
        console.log(`Bucket '${Bucket.Name}' already exist`);
        return;
      }
    }

    await s3Client.send(
      new CreateBucketCommand({ Bucket: bucket }) // ACL: "public-read"
    );
    console.log(`Bucket '${bucket}' successfully created`);

    const input = {
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedMethods: ["PUT", "POST", "GET"],
            AllowedOrigins: ["*"],
            AllowedHeaders: ["*"],
          },
        ],
      },
    };
    const command = new PutBucketCorsCommand(input);
    await s3Client.send(command);
    console.log(`Bucket '${bucket}' successfully set CORS`);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    console.log(`Bucket '${bucket}' successfully put`);
  } catch (err) {
    console.log("Error", err);
  }
};

const copy = async () => {
  await copyObject(s3Client, {
    source: `${bucket}/${key}test.csv`,
    bucket: bucket,
    key: `${parsedKey}${Date.now()}.csv`,
  });
  console.log("finish event copied");
};

export async function getObject(
  client: S3Client,
  input: { bucket: string; key: string }
) {
  const config = {
    Bucket: input.bucket,
    Key: input.key,
  };
  return client.send(new GetObjectCommand(config));
}

export async function deleteObject(
  client: S3Client,
  input: { bucket: string; key: string }
) {
  const config = {
    Bucket: input.bucket,
    Key: input.key,
  };
  const result = await client.send(new DeleteObjectCommand(config));
  console.log("deleted from", input.bucket, input.key);
  return result;
}

export async function copyObject(
  client: S3Client,
  input: { source: string; bucket: string; key: string }
) {
  const config = {
    CopySource: input.source,
    Bucket: input.bucket,
    Key: input.key,
  };
  const result = await client.send(new CopyObjectCommand(config));
  console.log(`copied from ${key} to ${input.key}`);
  return result;
}

export async function generatePutSignedUrl(fileName = "", client?: S3Client) {
  const config = {
    Bucket: bucket,
    Key: `${key}${fileName}`,
  };
  console.log("Config to generate PUT url", JSON.stringify(config, null, 2));

  const command = new PutObjectCommand(config);
  const url = await getSignedUrl(client ?? s3Client, command, {
    expiresIn: 3 * 60,
  });
  console.log("Presigned PUT URL: ", url);
  return url;
}

export async function generateGetSignedUrl(fileName = "", client?: S3Client) {
  const config = {
    Bucket: bucket,
    Key: `${key}${fileName}`,
  };
  console.log("Config to generate GET url", JSON.stringify(config, null, 2));

  const command = new GetObjectCommand(config);
  const url = await getSignedUrl(client ?? s3Client, command, {
    expiresIn: 3 * 60,
  });
  console.log("Presigned GET URL: ", url);
  return url;
}

run();
