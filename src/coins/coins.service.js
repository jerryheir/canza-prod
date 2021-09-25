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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
        while (_) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.CoinsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var axios_1 = require("axios");
var coins_entity_1 = require("./coins.entity");
var COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/';
var CoinsService = /** @class */ (function () {
    function CoinsService(coinsRepository, supCoinsRepository) {
        this.coinsRepository = coinsRepository;
        this.supCoinsRepository = supCoinsRepository;
    }
    CoinsService.prototype.findSupportedCoinsAll = function (currency) {
        return __awaiter(this, void 0, void 0, function () {
            var supported_coins, sup_coins, curr, info, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.find()];
                    case 1:
                        supported_coins = _a.sent();
                        sup_coins = __spreadArray([], new Set(supported_coins.map(function (item) { return item.coin_name; })), true).join('%2C');
                        curr = currency.join('%2C');
                        return [4 /*yield*/, (0, axios_1["default"])(COINGECKO_BASE_URL + "simple/price?ids=" + sup_coins + "&vs_currencies=" + curr + "&include_24hr_change=true").then(function (res) { return res.data; })];
                    case 2:
                        info = _a.sent();
                        /*const data = await Promise.all(
                          supported_coins.map(async (item) => {
                            const info = await axios(
                              `${COINGECKO_BASE_URL}simple/price?ids=${item.coin_name}&vs_currencies=${currency}&include_24hr_change=true`,
                            ).then((res) => res.data);
                            return {
                              ...item,
                              info: info,
                            };
                          }),
                        );*/
                        common_1.Logger.log('findSupportedCoinsAll', info);
                        data = supported_coins
                            .map(function (item) {
                            var value = info[item.coin_name];
                            if (value) {
                                var prices = Object.keys(value).map(function (a) {
                                    return {
                                        currency: a,
                                        value: value[a],
                                        change_24hr: value[a + "_24h_change"]
                                    };
                                });
                                return __assign(__assign({}, item), { prices: prices });
                            }
                        })
                            .filter(function (a) { return a; });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CoinsService.prototype.getSwapRate = function (primary, coins) {
        return __awaiter(this, void 0, void 0, function () {
            var curr, info, value, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        curr = coins.join('%2C');
                        return [4 /*yield*/, (0, axios_1["default"])(COINGECKO_BASE_URL + "simple/price?ids=" + primary + "&vs_currencies=" + curr).then(function (res) { return res.data; })];
                    case 1:
                        info = _a.sent();
                        value = info[primary];
                        data = Object.keys(value).map(function (a) {
                            return {
                                currency: a,
                                value: value[a]
                            };
                        });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CoinsService.prototype.getCoinGeckoCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, axios_1["default"])(COINGECKO_BASE_URL + "simple/supported_vs_currencies").then(function (res) { return res.data; })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CoinsService.prototype.findMyCoins = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coinsRepository.find(object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService.prototype.findOneCoin = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coinsRepository.findOne(object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService.prototype.createSupportedCoin = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.save(object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService.prototype.updateSupportedCoin = function (supported_coin_id, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.update({
                            id: supported_coin_id
                        }, object)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CoinsService.prototype.getOneSupportedCoin = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.findOne({ id: id })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService.prototype.addMyCoin = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.save(object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService.prototype.updateMyCoin = function (coin_id, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supCoinsRepository.update({
                            id: coin_id
                        }, object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CoinsService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(coins_entity_1.Coins)),
        __param(1, (0, typeorm_1.InjectRepository)(coins_entity_1.SupportedCoins))
    ], CoinsService);
    return CoinsService;
}());
exports.CoinsService = CoinsService;
