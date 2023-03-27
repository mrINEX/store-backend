import type { AWS } from "@serverless/typescript";
import { handlerPath } from "@libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{id}",
        cors: true,
      },
    },
  ],
};
