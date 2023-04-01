import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import errorHandler from "@middy/http-error-handler";
export const middyfy = (handler) => {
    return middy(handler).use(middyJsonBodyParser()).use(errorHandler());
};
//# sourceMappingURL=lambda.js.map