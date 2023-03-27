import type { AWS } from "@serverless/typescript";
// import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default <AWS["functions"]>{
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors: true,
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
