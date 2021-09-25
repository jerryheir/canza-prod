"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SupportedCoins = exports.Coins = void 0;
var typeorm_1 = require("typeorm");
var Coins = /** @class */ (function () {
    function Coins() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Coins.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], Coins.prototype, "amount");
    __decorate([
        (0, typeorm_1.Column)()
    ], Coins.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Coins.prototype, "supported_coin_id");
    Coins = __decorate([
        (0, typeorm_1.Entity)('coins')
    ], Coins);
    return Coins;
}());
exports.Coins = Coins;
var SupportedCoins = /** @class */ (function () {
    function SupportedCoins() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], SupportedCoins.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], SupportedCoins.prototype, "type");
    __decorate([
        (0, typeorm_1.Column)()
    ], SupportedCoins.prototype, "image_url");
    __decorate([
        (0, typeorm_1.Column)()
    ], SupportedCoins.prototype, "coin_name");
    SupportedCoins = __decorate([
        (0, typeorm_1.Entity)('supported_coins')
    ], SupportedCoins);
    return SupportedCoins;
}());
exports.SupportedCoins = SupportedCoins;
// bch https://www.bitcoin.com/images/uploads/homepage-ticker-bch.png bitcoin-cash
// eth https://markets.bitcoin.com/images/coins/1027.png // ethereum
// xrp https://markets.bitcoin.com/images/coins/52.png // ripple
// ltc https://markets.bitcoin.com/images/coins/2.png litecoin
