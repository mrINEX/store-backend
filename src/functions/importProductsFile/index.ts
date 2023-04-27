import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: { origin: "*" },
        responses: {
          200: {
            description: "file",
            bodyType: "SignedUrl",
          },
          502: "Server error",
        },
        authorizer: {
          name: "basicAuthorizer",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "request",
          // arn: "arn:aws:lambda:us-east-1:888972506066:function:store-backend-dev-basicAuthorizer",
        },
      },
    },
  ],
};
