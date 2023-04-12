import {
  CreateBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "./ddbClient";

const bucket = "integration-with-s3";

const run = async () => {
  const command = new ListBucketsCommand({});
  const { Buckets } = await s3Client.send(command);

  for (const Bucket of Buckets) {
    if (Bucket.Name === bucket) {
      console.log(`Bucket '${Bucket.Name}' already exist`);
      return;
    }
  }

  try {
    await s3Client.send(
      new CreateBucketCommand({ Bucket: bucket, ACL: "public-read" })
    );
    console.log(`Bucket '${bucket}' successfully created`);
  } catch (err) {
    console.log("Error", err);
  }

  try {
    const params = {
      Bucket: bucket,
      Key: "uploaded/",
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(`Bucket '${bucket}' successfully put`, results);
  } catch (err) {
    console.log("Error", err);
  }
};
run();
