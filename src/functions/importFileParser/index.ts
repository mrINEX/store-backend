import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";
import {
  bucket as bucketName,
  key as uploaded,
} from "../../libs/importService";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: bucketName,
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: uploaded }, { suffix: ".csv" }],
        existing: true,
      },
    },
  ],
};
