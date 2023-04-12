import {
  CreateBucketCommand,
  ListBucketsCommand,
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
      await generateSignedUrl("name.png");
      return;
    default:
      console.log(`${process.argv[2]} does not support`);
  }
}

const create = async () => {
  try {
    const command = new ListBucketsCommand({});
    const { Buckets } = await s3Client.send(command);

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

export async function generateSignedUrl(fileName: string, client?: S3Client) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${key}${fileName}`,
  });
  const url = await getSignedUrl(client ?? s3Client, command, {
    expiresIn: 3 * 60,
  });
  console.log("Presigned URL: ", url);
  return url;
}

run();
