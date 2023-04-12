"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.middyfy = void 0;
var core_1 = __importDefault(require("@middy/core"));
var http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
var http_error_handler_1 = __importDefault(require("@middy/http-error-handler"));
var middyfy = function (handler) {
    return (0, core_1["default"])(handler)
        .use((0, http_json_body_parser_1["default"])())
        .use(logger())
        .use((0, http_error_handler_1["default"])({ fallbackMessage: "Server error" }));
};
exports.middyfy = middyfy;
function logger() {
    return {
        before: function (request) {
            console.log("Incoming event", JSON.stringify(request, null, 2));
        },
        after: function (request) {
            console.log("Outgoing event", JSON.stringify(request, null, 2));
        }
    };
}
//# sourceMappingURL=lambda.js.map