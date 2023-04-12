"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var schema_1 = __importDefault(require("./schema"));
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
                method: "post",
                path: "products",
                cors: true,
                responses: {
                    200: {
                        description: "product",
                        bodyType: "ProductsResponse"
                    },
                    502: "server error"
                },
                request: {
                    schemas: {
                        "application/json": schema_1["default"]
                    }
                }
            }
        },
    ]
};
//# sourceMappingURL=index.js.map