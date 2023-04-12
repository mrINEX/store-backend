"use strict";
exports.__esModule = true;
exports.docClient = exports.ddbDocClient = exports.client = exports.s3Client = exports.ddbClient = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var client_s3_1 = require("@aws-sdk/client-s3");
var credential_providers_1 = require("@aws-sdk/credential-providers");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var constants_1 = require("./constants");
exports.ddbClient = new client_dynamodb_1.DynamoDBClient({
    region: constants_1.REGION,
    credentials: (0, credential_providers_1.fromIni)({ profile: constants_1.PROFILE })
});
exports.s3Client = new client_s3_1.S3Client({
    region: constants_1.REGION,
    credentials: (0, credential_providers_1.fromIni)({ profile: constants_1.PROFILE })
});
exports.client = new client_dynamodb_1.DynamoDBClient({
    region: constants_1.REGION
});
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.ddbClient);
exports.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(exports.client);
//# sourceMappingURL=ddbClient.js.map