"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SwapToken = exports.Orders = void 0;
var typeorm_1 = require("typeorm");
var Orders = /** @class */ (function () {
    function Orders() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Orders.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "buy_type");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "supported_coin_id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "amount");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "request_amount");
    __decorate([
        (0, typeorm_1.Column)({ "default": 'created' })
    ], Orders.prototype, "resolved_status");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], Orders.prototype, "resolved_by");
    __decorate([
        (0, typeorm_1.Column)()
    ], Orders.prototype, "location_id");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], Orders.prototype, "amount_resolved_at");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], Orders.prototype, "currency_resolved_at");
    Orders = __decorate([
        (0, typeorm_1.Entity)('orders')
    ], Orders);
    return Orders;
}());
exports.Orders = Orders;
var SwapToken = /** @class */ (function () {
    function SwapToken() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], SwapToken.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "from");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "to");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "amount");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "fee");
    __decorate([
        (0, typeorm_1.Column)()
    ], SwapToken.prototype, "fee_currency");
    SwapToken = __decorate([
        (0, typeorm_1.Entity)('swaptoken')
    ], SwapToken);
    return SwapToken;
}());
exports.SwapToken = SwapToken;
