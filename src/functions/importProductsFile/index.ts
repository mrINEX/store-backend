import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    PRODUCTS_TABLE: "file",
  },
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        responses: {
          200: {
            description: "file",
          },
          502: "Server error",
        },
      },
    },
  ],
};
