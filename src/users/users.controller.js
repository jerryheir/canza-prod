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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var verifyEmail_1 = require("../users/templates/verifyEmail");
var helpers_1 = require("../helpers");
var platform_express_1 = require("@nestjs/platform-express");
var roles_guard_1 = require("../roles.guard");
var UsersController = /** @class */ (function () {
    function UsersController(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    UsersController.prototype.register = function (registerDto) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, bcrypt.hash(registerDto.password, 12)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.usersService.findOne({
                                email: registerDto.email
                            })];
                    case 2:
                        data = _a.sent();
                        if (data) {
                            throw new common_1.BadRequestException('User already exists');
                        }
                        return [4 /*yield*/, this.usersService.registerService(__assign(__assign({}, registerDto), { password: hashedPassword }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Registration successful'
                            }];
                    case 4:
                        err_1 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.registerAgents = function (registerDto) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, bcrypt.hash(registerDto.password, 12)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.usersService.findOne({
                                email: registerDto.email
                            })];
                    case 2:
                        data = _a.sent();
                        if (data) {
                            throw new common_1.BadRequestException('Agent already exists');
                        }
                        return [4 /*yield*/, this.usersService.registerService(__assign(__assign({}, registerDto), { password: hashedPassword, role: 2 }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Agents Registration successful'
                            }];
                    case 4:
                        err_2 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_2);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.login = function (loginDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var user, jwt, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.usersService.findOne({ email: loginDto.email })];
                    case 1:
                        user = _a.sent();
                        if (!user || (user && user.banned === 1)) {
                            throw new common_1.BadRequestException('Invalid credentials');
                        }
                        return [4 /*yield*/, bcrypt.compare(loginDto.password, user.password)];
                    case 2:
                        if (!(_a.sent())) {
                            throw new common_1.BadRequestException('Invalid credentials');
                        }
                        if (!user.verified) {
                            this.usersService.verifyEmail({ id: user.id, email: user.email });
                            return [2 /*return*/, response.status(403).json({
                                    status: 'error',
                                    message: 'This user has not verified their account. A new email has been sent!'
                                })];
                        }
                        return [4 /*yield*/, this.jwtService.signAsync({
                                id: user.id,
                                email: user.email
                            })];
                    case 3:
                        jwt = _a.sent();
                        response.cookie('x-token', jwt, { httpOnly: true });
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Log in successful',
                                data: {
                                    firstname: user.firstname,
                                    lastname: user.lastname,
                                    email: user.email,
                                    image_url: user.image_url,
                                    token: jwt
                                }
                            }];
                    case 4:
                        err_3 = _a.sent();
                        throw new common_1.InternalServerErrorException(err_3);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.getUser = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                try {
                    user = request['guardUser'];
                    return [2 /*return*/, {
                            status: 'success',
                            message: 'Retrieved successfully',
                            data: {
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                                image_url: user.image_url,
                                google_signin: user.google_signin,
                                wallet_balance: user.wallet_balance
                            }
                        }];
                }
                catch (err) {
                    throw new common_1.UnauthorizedException();
                }
                return [2 /*return*/];
            });
        });
    };
    UsersController.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findAll({ role: 2 })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'All agents fetched successfully',
                                data: data
                            }];
                }
            });
        });
    };
    // @Get('users')
    // async getAllUsers(): Promise<any[]> {
    //   return await this.usersService.findAll();
    // }
    UsersController.prototype.confirm = function (response, token) {
        return __awaiter(this, void 0, void 0, function () {
            var result, str, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.jwtService.verifyAsync(token)];
                    case 1:
                        result = _a.sent();
                        if (!(result && result.id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.usersService.findAndUpdate({
                                id: result.id
                            }, {
                                verified: true
                            })];
                    case 2:
                        _a.sent();
                        str = (0, verifyEmail_1.verificationDone)();
                        return [2 /*return*/, response.send(str)];
                    case 3: return [2 /*return*/, response.send('An Error occurred. Please try again later!')];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_4 = _a.sent();
                        common_1.Logger.log('err', err_4);
                        throw new common_1.UnauthorizedException();
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.requestReset = function (resetDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.findOne({ email: resetDto.email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.BadRequestException('Invalid credentials');
                        }
                        this.usersService.resetPassword(user.email, user.id);
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'An email has been sent!'
                            }];
                    case 2:
                        err_5 = _a.sent();
                        throw new common_1.ForbiddenException('Denied Access!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.resetPassword = function (response, token) {
        return __awaiter(this, void 0, void 0, function () {
            var result, user, randomHash, hashedPassword, page, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.jwtService.verifyAsync(token)];
                    case 1:
                        result = _a.sent();
                        if (!result)
                            return [2 /*return*/, response.send('Reset Password link has expired!')];
                        return [4 /*yield*/, this.usersService.findOne({ id: result.id })];
                    case 2:
                        user = _a.sent();
                        if (!(user && user.id)) return [3 /*break*/, 6];
                        randomHash = (0, helpers_1.generateRandomHash)(11);
                        return [4 /*yield*/, bcrypt.hash(randomHash, 12)];
                    case 3:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.usersService.forgotPassword(user.email, randomHash, response)];
                    case 4:
                        page = _a.sent();
                        return [4 /*yield*/, this.usersService.findAndUpdate({ id: user.id }, {
                                password: hashedPassword
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, page];
                    case 6: return [2 /*return*/, response.send('An Error occurred. Please try again later!')];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_6 = _a.sent();
                        throw new common_1.ForbiddenException('Denied Access!');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.changePassword = function (changeDto, response) {
        return __awaiter(this, void 0, void 0, function () {
            var user, hashedPassword, jwt, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.usersService.findOne({ email: changeDto.email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.BadRequestException('Invalid credentials');
                        }
                        return [4 /*yield*/, bcrypt.compare(changeDto.password, user.password)];
                    case 2:
                        if (!(_a.sent())) {
                            throw new common_1.BadRequestException('Invalid credentials');
                        }
                        return [4 /*yield*/, bcrypt.hash(changeDto.newPassword, 12)];
                    case 3:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, this.usersService.findAndUpdate({
                                id: user.id
                            }, {
                                password: hashedPassword
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.jwtService.signAsync({
                                id: user.id,
                                email: user.email
                            })];
                    case 5:
                        jwt = _a.sent();
                        response.cookie('x-token', jwt, { httpOnly: true });
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Password change successful',
                                data: {
                                    token: jwt
                                }
                            }];
                    case 6:
                        err_7 = _a.sent();
                        throw new common_1.InternalServerErrorException('Something went wrong!');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.editUser = function (request, editDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.usersService.findAndUpdate({ id: user.id }, __assign({}, editDto))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Profile updated successfully'
                            }];
                    case 2:
                        err_8 = _a.sent();
                        throw new common_1.InternalServerErrorException('Something went wrong!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.upload = function (request, file) {
        return __awaiter(this, void 0, void 0, function () {
            var user, data, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.usersService.upload(file)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.usersService.findAndUpdate({ id: user.id }, {
                                image_url: data
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Photo uploaded successfully',
                                data: data
                            }];
                    case 3:
                        err_9 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.logout = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                response.clearCookie('x-token');
                return [2 /*return*/, {
                        status: 'success',
                        message: 'Log out successful'
                    }];
            });
        });
    };
    UsersController.prototype.getMyContacts = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var user, data, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = request['guardUser'];
                        return [4 /*yield*/, this.usersService.getMyContacts(user.id)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Contacts fetched successfully',
                                data: data
                            }];
                    case 2:
                        err_10 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.addContact = function (request, contactDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request['guardUser'];
                        return [4 /*yield*/, this.usersService.addContact({
                                userId: user.id,
                                contact_id: contactDto.contact_id
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Added contact successfully'
                            }];
                }
            });
        });
    };
    UsersController.prototype.deleteContact = function (request, contactDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = request['guardUser'];
                        return [4 /*yield*/, this.usersService.deleteContact({
                                userId: user.id,
                                contact_id: contactDto.contact_id
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'Added deleted successfully'
                            }];
                }
            });
        });
    };
    UsersController.prototype.getAUser = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var i, data, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!query || !query.email)
                            throw new common_1.BadRequestException();
                        return [4 /*yield*/, this.usersService.findOne({ email: query.email })];
                    case 1:
                        i = _a.sent();
                        data = {
                            id: i.id,
                            email: i.email,
                            firstname: i.firstname,
                            lastname: i.lastname,
                            image_url: i.image_url,
                            phone: i.phone
                        };
                        return [2 /*return*/, {
                                status: 'success',
                                message: 'User fetched successfully',
                                data: data
                            }];
                    case 2:
                        err_11 = _a.sent();
                        throw new common_1.ForbiddenException('Denied Access!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Post)('register'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "register");
    __decorate([
        (0, common_1.Post)('register/agents'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "registerAgents");
    __decorate([
        (0, common_1.Post)('login'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], UsersController.prototype, "login");
    __decorate([
        (0, common_1.Get)('users/me'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "getUser");
    __decorate([
        (0, common_1.Get)('users/agents')
    ], UsersController.prototype, "getUsers");
    __decorate([
        (0, common_1.Get)('confirmation_code/:token'),
        __param(0, (0, common_1.Res)()),
        __param(1, (0, common_1.Param)('token'))
    ], UsersController.prototype, "confirm");
    __decorate([
        (0, common_1.Post)('request-reset'),
        __param(0, (0, common_1.Body)())
    ], UsersController.prototype, "requestReset");
    __decorate([
        (0, common_1.Get)('reset/:token'),
        __param(0, (0, common_1.Res)()),
        __param(1, (0, common_1.Param)('token'))
    ], UsersController.prototype, "resetPassword");
    __decorate([
        (0, common_1.Put)('change-password'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)({ passthrough: true }))
    ], UsersController.prototype, "changePassword");
    __decorate([
        (0, common_1.Put)('edit-profile'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "editUser");
    __decorate([
        (0, common_1.Post)('profile-picture'),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.UploadedFile)())
    ], UsersController.prototype, "upload");
    __decorate([
        (0, common_1.Post)('logout'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Res)({ passthrough: true }))
    ], UsersController.prototype, "logout");
    __decorate([
        (0, common_1.Get)('contacts/me'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "getMyContacts");
    __decorate([
        (0, common_1.Post)('contacts/add'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "addContact");
    __decorate([
        (0, common_1.Delete)('contacts'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "deleteContact");
    __decorate([
        (0, common_1.Get)('users/get'),
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        __param(0, (0, common_1.Query)())
    ], UsersController.prototype, "getAUser");
    UsersController = __decorate([
        (0, common_1.Controller)("" + helpers_1.API_VERSION)
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
