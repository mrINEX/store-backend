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
exports.__esModule = true;
var client_s3_1 = require("@aws-sdk/client-s3");
var ddbClient_1 = require("./ddbClient");
var bucket = "integration-with-s3";
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var command, Buckets, _i, Buckets_1, Bucket, err_1, params, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                command = new client_s3_1.ListBucketsCommand({});
                return [4, ddbClient_1.s3Client.send(command)];
            case 1:
                Buckets = (_a.sent()).Buckets;
                for (_i = 0, Buckets_1 = Buckets; _i < Buckets_1.length; _i++) {
                    Bucket = Buckets_1[_i];
                    console.log("Bucket '".concat(Bucket.Name, "' already exist"));
                    if (Bucket.Name === bucket) {
                        return [2];
                    }
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4, ddbClient_1.s3Client.send(new client_s3_1.CreateBucketCommand({ Bucket: bucket, ACL: "public-read" }))];
            case 3:
                _a.sent();
                console.log("Bucket '".concat(bucket, "' successfully created"));
                return [3, 5];
            case 4:
                err_1 = _a.sent();
                console.log("Error", err_1);
                return [3, 5];
            case 5:
                _a.trys.push([5, 7, , 8]);
                params = {
                    Bucket: bucket,
                    Key: "uploaded/"
                };
                return [4, ddbClient_1.s3Client.send(new client_s3_1.PutObjectCommand(params))];
            case 6:
                results = _a.sent();
                console.log("Bucket '".concat(bucket, "' successfully put"), results);
                return [3, 8];
            case 7:
                err_2 = _a.sent();
                console.log("Error", err_2);
                return [3, 8];
            case 8: return [2];
        }
    });
}); };
run();
//# sourceMappingURL=importService.js.map