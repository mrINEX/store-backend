import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import errorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";
// import validator from "@middy/validator";
// import { transpileSchema } from "@middy/validator/transpile";
// import { Context } from "aws-lambda";

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(errorHandler())
    .use(cors());
};

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
