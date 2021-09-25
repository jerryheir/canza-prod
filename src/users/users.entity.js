"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Contacts = exports.User = void 0;
var typeorm_1 = require("typeorm");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "firstname");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "lastname");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "password");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], User.prototype, "image_url");
    __decorate([
        (0, typeorm_1.Column)({ "default": 1 }) // 1 for user, 2 for agents, 3 for maybe admin
    ], User.prototype, "role");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "google_signin");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "verified");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "banned");
    __decorate([
        (0, typeorm_1.Column)({ "default": 1 })
    ], User.prototype, "location");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], User.prototype, "phone");
    __decorate([
        (0, typeorm_1.Column)({ "default": 0 })
    ], User.prototype, "wallet_balance");
    __decorate([
        (0, typeorm_1.Column)({ "default": null })
    ], User.prototype, "fcm_token");
    User = __decorate([
        (0, typeorm_1.Entity)('users')
    ], User);
    return User;
}());
exports.User = User;
var Contacts = /** @class */ (function () {
    function Contacts() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Contacts.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Contacts.prototype, "userId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Contacts.prototype, "contact_id");
    Contacts = __decorate([
        (0, typeorm_1.Entity)('contacts')
    ], Contacts);
    return Contacts;
}());
exports.Contacts = Contacts;
