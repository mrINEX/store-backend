import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
// import validator from "@middy/validator";
// import { transpileSchema } from "@middy/validator/transpile";
// import { Context } from "aws-lambda";

process.on("uncaughtException", (...errs) =>
  console.log("-- uncaughtException --", errs)
);
process.on("unhandledRejection", (...errs) =>
  console.log("-- unhandledRejection --", errs)
);

export const middyfy = (handler, http = true) => {
  if (http) {
    return middy(handler)
      .use(middyJsonBodyParser())
      .use(logger())
      .use(httpErrorHandler({ fallbackMessage: "Server error" }));
  }

  return middy(handler)
    .use(logger())
    .use(httpErrorHandler({ fallbackMessage: "Server error" }));
};

function logger(): middy.MiddlewareObj {
  return {
    before: (request) => {
      console.log("Incoming event", JSON.stringify(request, null, 2));
    },
    after: (request) => {
      console.log("Outgoing event", JSON.stringify(request, null, 2));
    },
  };
}

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
