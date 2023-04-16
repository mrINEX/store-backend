"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.generateGetSignedUrl = exports.generatePutSignedUrl = exports.copyObject = exports.deleteObject = exports.getObject = exports.parsedKey = exports.key = exports.bucket = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
var ddbClient_1 = require("./ddbClient");
var fs_1 = require("fs");
var pipeline = require("node:stream/promises").pipeline;
var csv_parser_1 = __importDefault(require("csv-parser"));
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
exports.bucket = "integration-with-s3";
exports.key = "uploaded/";
exports.parsedKey = "parsed/";
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = process.argv[2];
                    switch (_a) {
                        case "--create": return [3, 1];
                        case "--copy": return [3, 3];
                        case "--test": return [3, 5];
                    }
                    return [3, 7];
                case 1: return [4, create()];
                case 2:
                    _b.sent();
                    return [2];
                case 3: return [4, copy()];
                case 4:
                    _b.sent();
                    return [2];
                case 5: return [4, (function name() {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, pipeline((0, fs_1.createReadStream)(path_1["default"].join(process.cwd(), "src/functions/importFileParser/test.csv")), (0, csv_parser_1["default"])({ separator: ";" }), new stream_1.Writable({
                                            objectMode: true,
                                            write: function (chunk, _encoding, callback) {
                                                console.log("parsed product", chunk);
                                                callback();
                                            }
                                        }))];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    })()];
                case 6:
                    _b.sent();
                    return [2];
                case 7:
                    console.log("".concat(process.argv[2], " does not support"));
                    _b.label = 8;
                case 8: return [2];
            }
        });
    });
}
var create = function () { return __awaiter(void 0, void 0, void 0, function () {
    var Buckets, _i, Buckets_1, Bucket, input, command, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, ddbClient_1.s3Client.send(new client_s3_1.ListBucketsCommand({}))];
            case 1:
                Buckets = (_a.sent()).Buckets;
                for (_i = 0, Buckets_1 = Buckets; _i < Buckets_1.length; _i++) {
                    Bucket = Buckets_1[_i];
                    if (Bucket.Name === exports.bucket) {
                        console.log("Bucket '".concat(Bucket.Name, "' already exist"));
                        return [2];
                    }
                }
                return [4, ddbClient_1.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: exports.bucket }))];
            case 2:
                _a.sent();
                console.log("Bucket '".concat(exports.bucket, "' successfully created"));
                input = {
                    Bucket: exports.bucket,
                    CORSConfiguration: {
                        CORSRules: [
                            {
                                AllowedMethods: ["PUT", "POST", "GET"],
                                AllowedOrigins: ["*"],
                                AllowedHeaders: ["*"]
                            },
                        ]
                    }
                };
                command = new client_s3_1.PutBucketCorsCommand(input);
                return [4, ddbClient_1.s3Client.send(command)];
            case 3:
                _a.sent();
                console.log("Bucket '".concat(exports.bucket, "' successfully set CORS"));
                return [4, ddbClient_1.s3Client.send(new client_s3_1.PutObjectCommand({
                        Bucket: exports.bucket,
                        Key: exports.key
                    }))];
            case 4:
                _a.sent();
                console.log("Bucket '".concat(exports.bucket, "' successfully put"));
                return [3, 6];
            case 5:
                err_1 = _a.sent();
                console.log("Error", err_1);
                return [3, 6];
            case 6: return [2];
        }
    });
}); };
var copy = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, copyObject(ddbClient_1.s3Client, {
                    source: "".concat(exports.bucket, "/").concat(exports.key, "test.csv"),
                    bucket: exports.bucket,
                    key: "".concat(exports.parsedKey).concat(Date.now(), ".csv")
                })];
            case 1:
                _a.sent();
                console.log("finish event copied");
                return [2];
        }
    });
}); };
function getObject(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            config = {
                Bucket: input.bucket,
                Key: input.key
            };
            return [2, client.send(new client_s3_1.GetObjectCommand(config))];
        });
    });
}
exports.getObject = getObject;
function deleteObject(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            config = {
                Bucket: input.bucket,
                Key: input.key
            };
            return [2, client.send(new client_s3_1.DeleteObjectCommand(config))];
        });
    });
}
exports.deleteObject = deleteObject;
function copyObject(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            config = {
                CopySource: input.source,
                Bucket: input.bucket,
                Key: input.key
            };
            return [2, client.send(new client_s3_1.CopyObjectCommand(config))];
        });
    });
}
exports.copyObject = copyObject;
function generatePutSignedUrl(fileName, client) {
    if (fileName === void 0) { fileName = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var config, command, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = {
                        Bucket: exports.bucket,
                        Key: "".concat(exports.key).concat(fileName)
                    };
                    console.log("Config to generate PUT url", JSON.stringify(config, null, 2));
                    command = new client_s3_1.PutObjectCommand(config);
                    return [4, (0, s3_request_presigner_1.getSignedUrl)(client !== null && client !== void 0 ? client : ddbClient_1.s3Client, command, {
                            expiresIn: 3 * 60
                        })];
                case 1:
                    url = _a.sent();
                    console.log("Presigned PUT URL: ", url);
                    return [2, url];
            }
        });
    });
}
exports.generatePutSignedUrl = generatePutSignedUrl;
function generateGetSignedUrl(fileName, client) {
    if (fileName === void 0) { fileName = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var config, command, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = {
                        Bucket: exports.bucket,
                        Key: "".concat(exports.key).concat(fileName)
                    };
                    console.log("Config to generate GET url", JSON.stringify(config, null, 2));
                    command = new client_s3_1.GetObjectCommand(config);
                    return [4, (0, s3_request_presigner_1.getSignedUrl)(client !== null && client !== void 0 ? client : ddbClient_1.s3Client, command, {
                            expiresIn: 3 * 60
                        })];
                case 1:
                    url = _a.sent();
                    console.log("Presigned GET URL: ", url);
                    return [2, url];
            }
        });
    });
}
exports.generateGetSignedUrl = generateGetSignedUrl;
run();
//# sourceMappingURL=importService.js.map