import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
// import validator from "@middy/validator";
// import { transpileSchema } from "@middy/validator/transpile";
// import { Context } from "aws-lambda";

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(logger())
    .use(httpErrorHandler({ fallbackMessage: "Server error" }));
};

function logger(): middy.MiddlewareObj {
  return {
    before: (request) => {
      console.log("before", JSON.stringify(request, null, 2));
    },
    after: (request) => {
      console.log("after", JSON.stringify(request, null, 2));
    },
  };
}

// if (schema !== undefined) {
//   middyfiedHandler = middyfiedHandler.use(middyValidator(schema));
// }

// export const middyValidator = (
//   schema: object
// ): middy.MiddlewareObj<unknown, unknown, Error, Context> => {
//   return validator({
//     eventSchema: transpileSchema(schema, {
//       verbose: true,
//       messages: true,
//       coerceTypes: false,
//     }),
//   });
// };
