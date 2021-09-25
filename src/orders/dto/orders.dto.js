"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateOrderDto = exports.CreateOrderDto = void 0;
var class_validator_1 = require("class-validator");
var CreateOrderDto = /** @class */ (function () {
    function CreateOrderDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "post_type");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "buy_type");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "supported_coin_id");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "amount");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "location_id");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateOrderDto.prototype, "request_amount");
    return CreateOrderDto;
}());
exports.CreateOrderDto = CreateOrderDto;
var UpdateOrderDto = /** @class */ (function () {
    function UpdateOrderDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], UpdateOrderDto.prototype, "resolved_by");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], UpdateOrderDto.prototype, "amount_resolved_at");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], UpdateOrderDto.prototype, "currency_resolved_at");
    return UpdateOrderDto;
}());
exports.UpdateOrderDto = UpdateOrderDto;
