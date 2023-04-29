import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
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
          type: "REQUEST",
          // enableSimpleResponses: true,
          // payloadVersion: "2.0",
          // arn: "arn:aws:lambda:us-east-1:888972506066:function:store-backend-dev-basicAuthorizer",
        },
      },
    },
  ],
};
