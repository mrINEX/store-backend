"use strict";
exports.__esModule = true;
exports.middyfy = void 0;
var core_1 = require("@middy/core");
var http_json_body_parser_1 = require("@middy/http-json-body-parser");
var http_error_handler_1 = require("@middy/http-error-handler");
var middyfy = function (handler) {
    return (0, core_1["default"])(handler).use((0, http_json_body_parser_1["default"])()).use((0, http_error_handler_1["default"])());
};
exports.middyfy = middyfy;
//# sourceMappingURL=lambda.js.map