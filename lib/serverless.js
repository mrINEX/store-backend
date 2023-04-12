"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getProducts_1 = __importDefault(require("./src/functions/getProducts"));
var getProduct_1 = __importDefault(require("./src/functions/getProduct"));
var createProduct_1 = __importDefault(require("./src/functions/createProduct"));
var serverlessConfiguration = {
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
            shouldStartNameWithService: true
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
                Resource: "arn:aws:dynamodb:*"
            },
        ],
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
            PRODUCTS_TABLE: "products",
            STOCKS_TABLE: "stocks"
        }
    },
    functions: { getProducts: getProducts_1["default"], getProduct: getProduct_1["default"], createProduct: createProduct_1["default"] },
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
            packagePath: "".concat(__dirname, "/package.json")
        },
        autoswagger: {
            typefiles: ["./src/libs/products.d.ts"]
        }
    }
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map