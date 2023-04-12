"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getDdbTransactProductService = exports.getDdbStockService = exports.getDdbProductService = exports.getProductService = void 0;
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var axios_1 = __importDefault(require("axios"));
var util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
var productService;
function getProductService() {
    if (productService == null) {
        productService = new ProductService();
    }
    return productService;
}
exports.getProductService = getProductService;
function getDdbProductService(client, table) {
    return new DdbProductService(client, table);
}
exports.getDdbProductService = getDdbProductService;
function getDdbStockService(client, table) {
    return new DdbStockService(client, table);
}
exports.getDdbStockService = getDdbStockService;
function getDdbTransactProductService(client, tableNames) {
    return new DdbTransactProductService(client, {
        stock: tableNames.stock,
        product: tableNames.product
    });
}
exports.getDdbTransactProductService = getDdbTransactProductService;
var DdbStockService = (function () {
    function DdbStockService(client, table) {
        this.client = client;
        this.table = table;
    }
    DdbStockService.prototype.getStock = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.send(new lib_dynamodb_1.GetCommand({
                            TableName: this.table,
                            Key: {
                                pk: this.table,
                                sk: id
                            }
                        }))];
                    case 1:
                        product = _a.sent();
                        return [2, product.Item];
                }
            });
        });
    };
    DdbStockService.prototype.getStocks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.send(new lib_dynamodb_1.QueryCommand({
                            TableName: this.table,
                            KeyConditionExpression: "pk = :pk",
                            ExpressionAttributeValues: { ":pk": this.table }
                        }))];
                    case 1:
                        products = _a.sent();
                        return [2, products.Items];
                }
            });
        });
    };
    DdbStockService.prototype.putStock = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.table,
                            Item: __assign({ pk: this.table, sk: item.product_id }, item)
                        };
                        return [4, this.client.send(new lib_dynamodb_1.PutCommand(params))];
                    case 1:
                        data = _a.sent();
                        console.log("Success - stock added or updated", data);
                        return [2];
                }
            });
        });
    };
    return DdbStockService;
}());
var DdbProductService = (function () {
    function DdbProductService(client, table) {
        this.client = client;
        this.table = table;
    }
    DdbProductService.prototype.merge = function (products, stocks) {
        var _loop_1 = function (product) {
            var stock = stocks.find(function (stock) { return stock.product_id === product.id; });
            product.count = stock.count;
        };
        for (var _i = 0, products_1 = products; _i < products_1.length; _i++) {
            var product = products_1[_i];
            _loop_1(product);
        }
    };
    DdbProductService.prototype.getProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.send(new lib_dynamodb_1.GetCommand({
                            TableName: this.table,
                            Key: {
                                pk: this.table,
                                sk: id
                            }
                        }))];
                    case 1:
                        product = _a.sent();
                        return [2, product.Item];
                }
            });
        });
    };
    DdbProductService.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var products;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.client.send(new lib_dynamodb_1.QueryCommand({
                            TableName: this.table,
                            KeyConditionExpression: "pk = :pk",
                            ExpressionAttributeValues: { ":pk": this.table }
                        }))];
                    case 1:
                        products = _a.sent();
                        return [2, products.Items];
                }
            });
        });
    };
    DdbProductService.prototype.putProduct = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var image, params, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getImage(item.title)];
                    case 1:
                        image = _a.sent();
                        params = {
                            TableName: this.table,
                            Item: __assign({ pk: this.table, sk: item.id, image: image }, item)
                        };
                        return [4, this.client.send(new lib_dynamodb_1.PutCommand(params))];
                    case 2:
                        data = _a.sent();
                        console.log("Success - product added or updated", data);
                        return [2];
                }
            });
        });
    };
    DdbProductService.prototype.getImage = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var client_id, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client_id = "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
                        return [4, axios_1["default"].get("https://api.unsplash.com/search/photos/?client_id=".concat(client_id, "&query=").concat(title, "&per_page=1"))];
                    case 1:
                        res = _a.sent();
                        return [2, res.data.results[0].urls.small];
                }
            });
        });
    };
    return DdbProductService;
}());
var DdbTransactProductService = (function () {
    function DdbTransactProductService(client, tableNames) {
        this.client = client;
        this.tableNames = tableNames;
    }
    DdbTransactProductService.prototype.createStockParams = function (item) {
        return {
            TableName: this.tableNames.stock,
            Item: (0, util_dynamodb_1.marshall)(__assign({ pk: this.tableNames.stock, sk: item.product_id }, item))
        };
    };
    DdbTransactProductService.prototype.createProductParams = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var image;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getImage(item.title)];
                    case 1:
                        image = _a.sent();
                        return [2, {
                                TableName: this.tableNames.product,
                                Item: (0, util_dynamodb_1.marshall)(__assign({ pk: this.tableNames.product, sk: item.id, image: image }, item))
                            }];
                }
            });
        });
    };
    DdbTransactProductService.prototype.putTransact = function (_a) {
        var itemStock = _a.itemStock, itemProduct = _a.itemProduct;
        return __awaiter(this, void 0, void 0, function () {
            var stockParams, productParams, input, command, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        stockParams = this.createStockParams(itemStock);
                        return [4, this.createProductParams(itemProduct)];
                    case 1:
                        productParams = _b.sent();
                        input = {
                            TransactItems: [{ Put: stockParams }, { Put: productParams }]
                        };
                        command = new client_dynamodb_1.TransactWriteItemsCommand(input);
                        return [4, this.client.send(command)];
                    case 2:
                        response = _b.sent();
                        console.log("Success - transact for ".concat(this.tableNames.stock, " and ").concat(this.tableNames.product), response);
                        return [2, response];
                }
            });
        });
    };
    DdbTransactProductService.prototype.getImage = function (title) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var defaultImage, client_id, res;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        defaultImage = "https://images.unsplash.com/photo-1546190255-451a91afc548?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max";
                        client_id = "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
                        return [4, axios_1["default"].get("https://api.unsplash.com/search/collections/?client_id=".concat(client_id, "&query=cats,").concat(title, "&per_page=1"))];
                    case 1:
                        res = _f.sent();
                        return [2, (_e = (_d = (_c = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.results[0]) === null || _b === void 0 ? void 0 : _b.cover_photo) === null || _c === void 0 ? void 0 : _c.urls) === null || _d === void 0 ? void 0 : _d.small) !== null && _e !== void 0 ? _e : defaultImage];
                }
            });
        });
    };
    return DdbTransactProductService;
}());
var ProductService = (function () {
    function ProductService() {
    }
    ProductService.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.mock == null) {
                    this.mock = Promise.all([
                        { cat: "Ragdoll", id: "7eadbebe-0900-4b10-afde-d2a303bcfbd9" },
                        {
                            cat: "Exotic Shorthair",
                            id: "0301dd99-39a2-4781-81e3-77e6162827b2"
                        },
                        {
                            cat: "British Shorthair",
                            id: "f6915b02-321a-47aa-b712-76580f9e27bb"
                        },
                        { cat: "Maine Coon", id: "f3fbcae8-4dce-4c68-bda0-103a92adc4a3" },
                        { cat: "Devon Rex", id: "e0ff5437-a160-47b7-af7a-ba8b300b6625" },
                        { cat: "Sphynx", id: "bf2144c7-6762-4889-839a-6b1e2cf3d823" },
                        { cat: "Scottish Fold", id: "84b32bc9-ff22-49de-b94d-c02eb5a9829f" },
                        { cat: "Abyssinian", id: "0134c71c-3931-4e38-8aae-219bd2156da7" },
                        { cat: "Siamese", id: "e211c2c1-f305-4705-ad5d-ef87527b03d0" },
                        { cat: "Cornish Rex", id: "88f6353b-3df9-4ab7-bec4-aa9708a1f4e1" },
                        { cat: "Russian Blue", id: "f5a3565a-6806-4da8-acd6-15aa467a7f9d" },
                    ].map(function (_a) {
                        var cat = _a.cat, uuid = _a.id;
                        return __awaiter(_this, void 0, void 0, function () {
                            var client_id, res;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        client_id = "87e26779aa6242a2b2fc8e863886185d1d1f07215e4890071e45448baedf8950";
                                        return [4, axios_1["default"].get("https://api.unsplash.com/search/photos/?client_id=".concat(client_id, "&query=").concat(cat, "&per_page=1"))];
                                    case 1:
                                        res = _b.sent();
                                        return [2, {
                                                title: cat,
                                                description: res.data.results[0].description,
                                                id: uuid,
                                                price: this.getRandomInt(1, 50),
                                                image: res.data.results[0].urls.small
                                            }];
                                }
                            });
                        });
                    }));
                }
                return [2, this.mock];
            });
        });
    };
    ProductService.prototype.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    };
    return ProductService;
}());
//# sourceMappingURL=productService.js.map