import type { AWS } from "@serverless/typescript";

import getProducts from "./src/functions/getProducts";
import getProduct from "./src/functions/getProduct";

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
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:Query", "dynamodb:GetItem"],
        Resource: "arn:aws:dynamodb:*",
      },
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCTS_TABLE: "products",
      STOCKS_TABLE: "stocks",
    },
  },
  // import the function via paths
  functions: { getProducts, getProduct },
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
