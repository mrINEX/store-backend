"use strict";
exports.__esModule = true;
var handler_resolver_1 = require("../../libs/handler-resolver");
exports["default"] = {
    handler: "".concat((0, handler_resolver_1.handlerPath)(__dirname), "/handler.main"),
    environment: {
        PRODUCTS_TABLE: "${self:provider.environment.PRODUCTS_TABLE}",
        STOCKS_TABLE: "${self:provider.environment.STOCKS_TABLE}"
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
                        bodyType: "ProductsResponse"
                    },
                    502: "server error"
                }
            }
        },
    ]
};
//# sourceMappingURL=index.js.map