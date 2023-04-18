import type { AWS } from "@serverless/typescript";

import getProducts from "./src/functions/getProducts";
import getProduct from "./src/functions/getProduct";
import createProduct from "./src/functions/createProduct";
import importProductsFile from "./src/functions/importProductsFile";
import importFileParser from "./src/functions/importFileParser";
import catalogBatchProcess from "./src/functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "store-backend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-auto-swagger"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    profile: "freeaws_sls",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
            Resource: "arn:aws:dynamodb:*",
          },
          {
            Effect: "Allow",
            Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            Resource: "arn:aws:s3:::*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "arn:aws:sqs:*",
          },
        ],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: "products",
      STOCKS_TABLE: "stocks",
      BUCKET_NAME: "integration-with-s3",
      SQS: { Ref: "catalogItemsQueue" },
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProducts,
    getProduct,
    createProduct,
    importProductsFile,
    importFileParser,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
      external: ["axios"],
      packagePath: `${__dirname}/package.json`,
    },
    autoswagger: {
      typefiles: ["./src/libs/products.d.ts"],
    },
  },
};

module.exports = serverlessConfiguration;
