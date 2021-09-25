"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SendCoinDto = exports.CreateSwapDto = exports.CoinsDto = exports.SupportedCoinsDto = void 0;
var class_validator_1 = require("class-validator");
var SupportedCoinsDto = /** @class */ (function () {
    function SupportedCoinsDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], SupportedCoinsDto.prototype, "type");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], SupportedCoinsDto.prototype, "image_url");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], SupportedCoinsDto.prototype, "coin_name");
    return SupportedCoinsDto;
}());
exports.SupportedCoinsDto = SupportedCoinsDto;
var CoinsDto = /** @class */ (function () {
    function CoinsDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CoinsDto.prototype, "amount");
    return CoinsDto;
}());
exports.CoinsDto = CoinsDto;
var CreateSwapDto = /** @class */ (function () {
    function CreateSwapDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateSwapDto.prototype, "from");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateSwapDto.prototype, "to");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateSwapDto.prototype, "amount");
    return CreateSwapDto;
}());
exports.CreateSwapDto = CreateSwapDto;
var SendCoinDto = /** @class */ (function () {
    function SendCoinDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], SendCoinDto.prototype, "amount");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], SendCoinDto.prototype, "supported_coin_id");
    return SendCoinDto;
}());
exports.SendCoinDto = SendCoinDto;
