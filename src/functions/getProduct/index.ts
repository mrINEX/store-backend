import type { AWS } from "@serverless/typescript";
import { handlerPath } from "../../libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    PRODUCTS_TABLE: "${self:provider.environment.PRODUCTS_TABLE}",
    STOCKS_TABLE: "${self:provider.environment.STOCKS_TABLE}",
  },
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
