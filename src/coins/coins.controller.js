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
exports.__esModule = true;
exports.CoinsController = void 0;
var common_1 = require("@nestjs/common");
var helpers_1 = require("../helpers");
var roles_guard_1 = require("../roles.guard");
var CoinsController = /** @class */ (function () {
    function CoinsController(coinsService, notificationsService) {
        this.coinsService = coinsService;
        this.notificationsService = notificationsService;
    }
    CoinsController.prototype.getCoins = function (request, currency) {
        return __awaiter(this, void 0, void 0, function () {
            var c, user, curr, my_coins, supported_coins_1, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        c = currency.split(',');
                        user = request['guardUser'];
                        curr = c && c.length > 0 ? c : ['ngn'];
                        return [4 /*yield*/, this.coinsService.findMyCoins({ userId: user.id })];
                    case 1:
                        my_coins = _a.sent();
                        return [4 /*yield*/, this.coinsService.findSupportedCoinsAll(curr)];
                    case 2:
                        supported_coins_1 = _a.sent();
                        data = my_coins.map(function (item) {
                            var sup = supported_coins_1.find(function (a) { return a.id === item.supported_coin_id; });
                            return __assign(__assign({}, sup), item);
                        });
                        console.log('BEFORE return getCoins', data);
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'All Supported Coins',
                                data: data
                            }];
                    case 3:
                        err_1 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.getSwapRate = function (primary, coins) {
        return __awaiter(this, void 0, void 0, function () {
            var c, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        c = coins.split(',');
                        return [4 /*yield*/, this.coinsService.getSwapRate(primary, c)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Swap rates returned successfully',
                                data: data
                            }];
                    case 2:
                        err_2 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.getCoinGeckoCurrencies = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.coinsService.getCoinGeckoCurrencies()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Currency formats returned successfully',
                                data: data
                            }];
                    case 2:
                        err_3 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // @Put('set/:supported_coin_id')
    // @UseGuards(RolesGuard)
    // async setAsset(
    //   @Req() request: Request,
    //   @Param('supported_coin_id') supported_coin_id: number,
    //   @Body() supportedCoins: CoinsDto,
    // ): Promise<responseData> {
    //   try {
    //     const user = request['guardUser'];
    //     const coin = await this.coinsService.findOneCoin({
    //       userId: user.id,
    //       supported_coin_id: supported_coin_id,
    //     });
    //     if (coin) {
    //       await this.coinsService.updateMyCoin(coin.id, {
    //         amount: coin.amount + supportedCoins.amount,
    //       });
    //       return {
    //         status: 'success',
    //         message: 'Coin updated successfully!',
    //       };
    //     } else {
    //       await this.coinsService.addMyCoin({
    //         ...supportedCoins,
    //         userId: user.id,
    //         supported_coin_id: supported_coin_id,
    //       });
    //       return {
    //         status: 'success',
    //         message: 'Coin successfully added!',
    //       };
    //     }
    //   } catch (err) {
    //     throw new UnauthorizedException('Unauthorized');
    //   }
    // }
    CoinsController.prototype.getSupportedCoins = function (currency) {
        return __awaiter(this, void 0, void 0, function () {
            var c, curr, data, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        c = currency.split(',');
                        curr = c && c.length > 0 ? c : ['ngn', 'usd', 'gbp'];
                        return [4 /*yield*/, this.coinsService.findSupportedCoinsAll(curr)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'All Supported Coins',
                                data: data
                            }];
                    case 2:
                        err_4 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.createSupportedCoins = function (request, supportedCoins) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        user = request['guardUser'];
                        if (!(user.role && user.role > 2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.coinsService.createSupportedCoin(supportedCoins)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Coin successfully added!'
                            }];
                    case 2: throw new common_1.UnauthorizedException('Unauthorized');
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.updateSupportedCoins = function (request, supported_coin_id, supportedCoins) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        user = request['guardUser'];
                        if (!(user.role && user.role > 2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.coinsService.updateSupportedCoin(supported_coin_id, supportedCoins)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Coin updated successfully!'
                            }];
                    case 2: throw new common_1.UnauthorizedException('Unauthorized');
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_6 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.requestSwapToken = function (request, createSwapDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, coin, other, supported, otherSupported_1, swapRate, rate, updatedResult, updatedResult, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        user = request['guardUser'];
                        if (createSwapDto.from === createSwapDto.to)
                            throw new common_1.BadRequestException();
                        return [4 /*yield*/, this.coinsService.findOneCoin({
                                userId: user.id,
                                supported_coin_id: createSwapDto.from
                            })];
                    case 1:
                        coin = _a.sent();
                        if (!(coin &&
                            coin.amount &&
                            coin.amount -
                                createSwapDto.amount -
                                createSwapDto.amount * 0 /*0.01*/ >=
                                0) // 2 btc - 1 btc - 0.01 fee >= 0
                        ) return [3 /*break*/, 12]; // 2 btc - 1 btc - 0.01 fee >= 0
                        return [4 /*yield*/, this.coinsService.findOneCoin({
                                userId: user.id,
                                supported_coin_id: createSwapDto.to
                            })];
                    case 2:
                        other = _a.sent();
                        return [4 /*yield*/, this.coinsService.getOneSupportedCoin(createSwapDto.from)];
                    case 3:
                        supported = _a.sent();
                        return [4 /*yield*/, this.coinsService.getOneSupportedCoin(createSwapDto.to)];
                    case 4:
                        otherSupported_1 = _a.sent();
                        return [4 /*yield*/, this.coinsService.getSwapRate(supported.coin_name, [otherSupported_1.type])];
                    case 5:
                        swapRate = _a.sent();
                        rate = swapRate.find(function (a) { return a.currency === otherSupported_1.type; }).value *
                            createSwapDto.amount;
                        return [4 /*yield*/, this.coinsService.updateMyCoin(coin.id, {
                                amount: coin.amount -
                                    createSwapDto.amount -
                                    createSwapDto.amount * 0 /*0.01*/
                            })];
                    case 6:
                        _a.sent();
                        if (!other) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.coinsService.updateMyCoin(other.id, {
                                amount: other.amount + rate
                            })];
                    case 7:
                        updatedResult = _a.sent();
                        return [4 /*yield*/, this.notificationsService.createNotifications({
                                userId: 1,
                                type: 'swap',
                                description: "You have successfully swapped " + createSwapDto.from + " " + supported.type.toUpperCase() + " to " + rate + " " + otherSupported_1.type.toUpperCase(),
                                metadata: JSON.stringify(__assign({}, updatedResult))
                            })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Swap completed successfully',
                                data: updatedResult.generatedMaps.find(function (a) { return a.id; }, other.id)
                            }];
                    case 9: return [4 /*yield*/, this.coinsService.addMyCoin({
                            amount: rate,
                            userId: user.id,
                            supported_coin_id: createSwapDto.to
                        })];
                    case 10:
                        updatedResult = _a.sent();
                        return [4 /*yield*/, this.notificationsService.createNotifications({
                                userId: 1,
                                type: 'swap',
                                description: "You have successfully swapped " + createSwapDto.amount + " " + supported.type.toUpperCase() + " to " + rate + " " + otherSupported_1.type.toUpperCase(),
                                metadata: JSON.stringify(__assign({}, updatedResult))
                            })];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Swap completed successfully',
                                data: updatedResult.generatedMaps.find(function (a) { return a.id; }, other.id)
                            }];
                    case 12: return [2 /*return*/, {
                            status: 'error',
                            message: 'Something went wrong. Please check your canza wallet and try again'
                        }];
                    case 13:
                        err_7 = _a.sent();
                        throw new common_1.InternalServerErrorException('An error occurred!');
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CoinsController.prototype.sendCoin = function (request, contact_id, sendCoin) {
        return __awaiter(this, void 0, void 0, function () {
            var user, myCoin, otherCoin, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.coinsService.findOneCoin({
                                userId: user.id,
                                supported_coin_id: sendCoin.supported_coin_id
                            })];
                    case 1:
                        myCoin = _a.sent();
                        return [4 /*yield*/, this.coinsService.findOneCoin({
                                userId: contact_id,
                                supported_coin_id: sendCoin.supported_coin_id
                            })];
                    case 2:
                        otherCoin = _a.sent();
                        if (!myCoin || (myCoin && myCoin.amount < sendCoin.amount)) {
                            throw new common_1.BadRequestException('Insufficient assets. Check your assets and try again');
                        }
                        if (!otherCoin) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.coinsService.updateMyCoin(otherCoin.id, {
                                amount: otherCoin.amount + sendCoin.amount
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.coinsService.addMyCoin(__assign(__assign({}, sendCoin), { userId: contact_id }))];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, {
                            status: 'success',
                            message: "Asset sent successfully"
                        }];
                    case 7:
                        err_8 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('me'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Query)('currency'))
    ], CoinsController.prototype, "getCoins");
    __decorate([
        (0, common_1.Get)('swap-rate/:primary'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Param)()),
        __param(1, (0, common_1.Query)('coins'))
    ], CoinsController.prototype, "getSwapRate");
    __decorate([
        (0, common_1.Get)('currencies'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard)
    ], CoinsController.prototype, "getCoinGeckoCurrencies");
    __decorate([
        (0, common_1.Get)(),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Query)('currency'))
    ], CoinsController.prototype, "getSupportedCoins");
    __decorate([
        (0, common_1.Post)('create'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], CoinsController.prototype, "createSupportedCoins");
    __decorate([
        (0, common_1.Put)('update/:supported_coin_id'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('supported_coin_id')),
        __param(2, (0, common_1.Body)())
    ], CoinsController.prototype, "updateSupportedCoins");
    __decorate([
        (0, common_1.Put)('request-swap'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], CoinsController.prototype, "requestSwapToken");
    __decorate([
        (0, common_1.Post)('send/:id'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id')),
        __param(2, (0, common_1.Body)())
    ], CoinsController.prototype, "sendCoin");
    CoinsController = __decorate([
        (0, common_1.Controller)(helpers_1.API_VERSION + "coins")
    ], CoinsController);
    return CoinsController;
}());
exports.CoinsController = CoinsController;
