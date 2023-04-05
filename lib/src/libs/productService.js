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
exports.getProductService = void 0;
var axios_1 = require("axios");
var productService;
function getProductService() {
    if (productService == null) {
        productService = new ProductService();
    }
    return productService;
}
exports.getProductService = getProductService;
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