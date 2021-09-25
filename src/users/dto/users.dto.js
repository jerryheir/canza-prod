"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResetDto = exports.EditProfileDto = exports.ChangePasswordDto = exports.LoginDto = exports.AgentsDto = exports.RegisterDto = void 0;
var class_validator_1 = require("class-validator");
var RegisterDto = /** @class */ (function () {
    function RegisterDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], RegisterDto.prototype, "firstname");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], RegisterDto.prototype, "lastname");
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], RegisterDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], RegisterDto.prototype, "password");
    return RegisterDto;
}());
exports.RegisterDto = RegisterDto;
var AgentsDto = /** @class */ (function () {
    function AgentsDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], AgentsDto.prototype, "firstname");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], AgentsDto.prototype, "lastname");
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], AgentsDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], AgentsDto.prototype, "password");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], AgentsDto.prototype, "location");
    __decorate([
        (0, class_validator_1.IsOptional)()
    ], AgentsDto.prototype, "image_url");
    return AgentsDto;
}());
exports.AgentsDto = AgentsDto;
var LoginDto = /** @class */ (function () {
    function LoginDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], LoginDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], LoginDto.prototype, "password");
    return LoginDto;
}());
exports.LoginDto = LoginDto;
var ChangePasswordDto = /** @class */ (function () {
    function ChangePasswordDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], ChangePasswordDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], ChangePasswordDto.prototype, "password");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], ChangePasswordDto.prototype, "newPassword");
    return ChangePasswordDto;
}());
exports.ChangePasswordDto = ChangePasswordDto;
var EditProfileDto = /** @class */ (function () {
    function EditProfileDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], EditProfileDto.prototype, "email");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], EditProfileDto.prototype, "firstname");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], EditProfileDto.prototype, "lastname");
    __decorate([
        (0, class_validator_1.IsOptional)()
    ], EditProfileDto.prototype, "image_url");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], EditProfileDto.prototype, "location");
    return EditProfileDto;
}());
exports.EditProfileDto = EditProfileDto;
var ResetDto = /** @class */ (function () {
    function ResetDto() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEmail)()
    ], ResetDto.prototype, "email");
    return ResetDto;
}());
exports.ResetDto = ResetDto;
