import {
  CreateBucketCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./ddbClient";

const bucket = "integration-with-s3";
const key = "uploaded/";

async function run() {
  switch (process.argv[2]) {
    case "--create":
      await create();
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
