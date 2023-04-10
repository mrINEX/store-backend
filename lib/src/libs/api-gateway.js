"use strict";
exports.__esModule = true;
exports.formatJSONResponse = void 0;
var formatJSONResponse = function (response) {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(response)
    };
};
exports.formatJSONResponse = formatJSONResponse;
//# sourceMappingURL=api-gateway.js.map