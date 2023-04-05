"use strict";
exports.__esModule = true;
exports.ddbDocClient = exports.ddbClient = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var credential_providers_1 = require("@aws-sdk/credential-providers");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var constants_1 = require("./constants");
exports.ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: constants_1.REGION,
    credentials: (0, credential_providers_1.fromIni)({ profile: constants_1.PROFILE })
});
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.ddbClient);
//# sourceMappingURL=ddbClient.js.map