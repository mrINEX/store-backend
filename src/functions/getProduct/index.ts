import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{id}",
        cors: true,
        responses: {
          200: {
            description: "product",
            bodyType: "ProductResponse",
          },
          404: {
            description: "product not found",
            bodyType: "NotFound",
          },
          502: "server error",
        },
      },
    },
  ],
};
