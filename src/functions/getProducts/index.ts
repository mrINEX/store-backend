import type { AWS } from "@serverless/typescript";
// import schema from "./schema";
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
        path: "products",
        cors: true,
        responses: {
          200: {
            description: "products",
            bodyType: "ProductsResponse",
          },
          502: "server error",
        },
        // request: {
        //   schemas: {
        //     "application/json": schema,
        //     body: null,
        //   },
        // },
      },
    },
  ],
};
