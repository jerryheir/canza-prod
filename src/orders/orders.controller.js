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
exports.OrdersController = void 0;
var common_1 = require("@nestjs/common");
var helpers_1 = require("../helpers");
var roles_guard_1 = require("../roles.guard");
var OrdersController = /** @class */ (function () {
    function OrdersController(usersService, ordersService, coinsService, notificationsService) {
        this.usersService = usersService;
        this.ordersService = ordersService;
        this.coinsService = coinsService;
        this.notificationsService = notificationsService;
    }
    OrdersController.prototype.getMyOrders = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var user, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.ordersService.getAnOrder({ userId: user.id })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Orders retrieved successfully',
                                data: data
                            }];
                    case 2:
                        err_1 = _a.sent();
                        throw new common_1.InternalServerErrorException('An error occurred!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.getAllOrders = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var user, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        user = request['guardUser'];
                        if (!(user.role && user.role > 2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.ordersService.getAllOrders()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Orders retrieved successfully',
                                data: data
                            }];
                    case 2: throw new common_1.UnauthorizedException('Unauthorized');
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.updateMyOrder = function (id, updateOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var order, supported, resolvingUser, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.ordersService.getAnOrder({ id: id })];
                    case 1:
                        order = _a.sent();
                        return [4 /*yield*/, this.coinsService.getOneSupportedCoin(order.supported_coin_id)];
                    case 2:
                        supported = _a.sent();
                        if (!(order &&
                            updateOrderDto &&
                            updateOrderDto.resolved_by &&
                            !order.resolved_by)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.usersService.findOne({
                                id: updateOrderDto.resolved_by
                            })];
                    case 3:
                        resolvingUser = _a.sent();
                        if (!resolvingUser) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.ordersService.updateMyOrder({
                                id: id
                            }, __assign(__assign({}, updateOrderDto), { resolved_status: 'pending' }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.notificationsService.createNotifications({
                                userId: 1,
                                type: 'order',
                                description: "Your order to " + (order.buy_type === 1 ? 'buy' : 'sell') + " " + order.amount + " " + supported.type.toUpperCase() + " has been accepted by " + resolvingUser.firstname + " " + resolvingUser.lastname + ".",
                                metadata: JSON.stringify(__assign(__assign({}, order), { resolved_status: 'pending' }))
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Order updated successfully'
                            }];
                    case 6: throw new common_1.BadRequestException();
                    case 7: throw new common_1.BadRequestException();
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_3 = _a.sent();
                        throw new common_1.InternalServerErrorException('An error occurred!');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.resolveOrder = function (request, id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, order, supported, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.ordersService.getAnOrder({
                                id: id,
                                resolved_by: user.id
                            })];
                    case 1:
                        order = _a.sent();
                        return [4 /*yield*/, this.coinsService.getOneSupportedCoin(order.supported_coin_id)];
                    case 2:
                        supported = _a.sent();
                        if (!order) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.ordersService.updateMyOrder({
                                id: id
                            }, {
                                resolved_status: 'completed'
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.notificationsService.createNotifications({
                                userId: 1,
                                type: 'order',
                                description: "Your order to " + (order.buy_type === 1 ? 'buy' : 'sell') + " " + order.amount + " " + supported.type.toUpperCase() + " has been completed.",
                                metadata: JSON.stringify(__assign(__assign({}, order), { resolved_status: 'completed' }))
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Order resolved successfully'
                            }];
                    case 5: throw new common_1.BadRequestException();
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_4 = _a.sent();
                        throw new common_1.InternalServerErrorException('An error occurred!');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    OrdersController.prototype.createOrder = function (request, createOrderDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, supported_1, swapRate, rate, myCoin, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.coinsService.getOneSupportedCoin(createOrderDto.supported_coin_id)];
                    case 1:
                        supported_1 = _a.sent();
                        return [4 /*yield*/, this.coinsService.getSwapRate(supported_1.coin_name, ['ngn'])];
                    case 2:
                        swapRate = _a.sent();
                        rate = swapRate.find(function (a) { return a.currency === supported_1.type; }).value *
                            createOrderDto.amount;
                        if (createOrderDto.buy_type === 1) {
                            if (user.wallet_balance < createOrderDto.request_amount) {
                                throw new common_1.BadRequestException('Insufficient funds. Fund your wallet and try again.');
                            }
                            this.usersService.findAndUpdate({
                                id: user.id
                            }, {
                                wallet_balance: user.wallet_balance - rate
                            });
                        }
                        if (!(createOrderDto.buy_type === 2)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.coinsService.findOneCoin({
                                userId: user.id,
                                supported_coin_id: createOrderDto.supported_coin_id
                            })];
                    case 3:
                        myCoin = _a.sent();
                        if (myCoin.amount <
                            createOrderDto.amount /* Subtract the percentage for fee also */) {
                            throw new common_1.BadRequestException('Insufficient assets. Check your assets and try again');
                        }
                        this.coinsService.updateMyCoin(myCoin.id, {
                            amount: myCoin.amount -
                                createOrderDto.amount /* Subtract the percentage for fee also */
                        });
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.ordersService.createOrder(__assign(__assign({}, createOrderDto), { userId: user.id }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.notificationsService.createNotifications({
                                userId: 1,
                                type: 'order',
                                description: "Your request to " + (createOrderDto.buy_type === 1 ? 'buy' : 'sell') + " " + createOrderDto.amount + " " + supported_1.type.toUpperCase() + " was posted on the Canza Market Place.",
                                metadata: JSON.stringify(__assign(__assign({}, createOrderDto), { resolved_status: 'created' }))
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Order created successfully'
                            }];
                    case 7:
                        err_5 = _a.sent();
                        throw new common_1.InternalServerErrorException('An error occurred!');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)('me'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)())
    ], OrdersController.prototype, "getMyOrders");
    __decorate([
        (0, common_1.Get)(''),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)())
    ], OrdersController.prototype, "getAllOrders");
    __decorate([
        (0, common_1.Put)('/:id'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], OrdersController.prototype, "updateMyOrder");
    __decorate([
        (0, common_1.Put)('/:id/resolved'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('id'))
    ], OrdersController.prototype, "resolveOrder");
    __decorate([
        (0, common_1.Post)('create'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], OrdersController.prototype, "createOrder");
    OrdersController = __decorate([
        (0, common_1.Controller)(helpers_1.API_VERSION + "orders")
    ], OrdersController);
    return OrdersController;
}());
exports.OrdersController = OrdersController;
