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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var nodemailer = require("nodemailer");
var aws_sdk_1 = require("aws-sdk");
var users_entity_1 = require("./users.entity");
var verifyEmail_1 = require("../users/templates/verifyEmail");
var helpers_1 = require("../helpers");
var UsersService = /** @class */ (function () {
    function UsersService(usersRepository, contactsRepository, configService, jwtService) {
        this.usersRepository = usersRepository;
        this.contactsRepository = contactsRepository;
        this.configService = configService;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: this.configService.get('EMAIL_SMTP_ADDRESS'),
                pass: this.configService.get('EMAIL_SMTP_PASSWORD')
            }
        });
    }
    UsersService.prototype.registerService = function (registerDto) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.save(__assign(__assign({}, registerDto), { google_signin: 0 }))];
                    case 1:
                        result = _a.sent();
                        this.verifyEmail(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.verifyEmail = function (result) {
        var emailToken = this.jwtService.sign({
            id: result.id
        });
        var url = "https://canza-api-6dbce.ondigitalocean.app/" + helpers_1.API_VERSION + "confirmation_code/" + emailToken;
        var options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: result.email,
            subject: 'Verify your email address',
            html: (0, verifyEmail_1.emailverification)(url)
        };
        this.transporter.sendMail(options, function (err, info) {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Verification email sent! ' + info);
        });
    };
    UsersService.prototype.findAll = function (a) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.find(a)];
                    case 1:
                        data = _a.sent();
                        result = data
                            ? data.map(function (i) {
                                return {
                                    id: i.id,
                                    email: i.email,
                                    verified: i.verified,
                                    firstname: i.firstname,
                                    lastname: i.lastname,
                                    location: i.location,
                                    image_url: i.image_url,
                                    phone: i.phone,
                                    banned: i.banned
                                };
                            })
                            : [];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UsersService.prototype.findOne = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOne(object)];
                    case 1:
                        i = _a.sent();
                        return [2 /*return*/, {
                                id: i.id,
                                email: i.email,
                                verified: i.verified,
                                firstname: i.firstname,
                                lastname: i.lastname,
                                location: i.location,
                                image_url: i.image_url,
                                phone: i.phone,
                                banned: i.banned,
                                wallet_balance: i.wallet_balance,
                                password: i.password
                            }];
                }
            });
        });
    };
    UsersService.prototype.getWalletBalance = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOne(object)];
                    case 1:
                        i = _a.sent();
                        return [2 /*return*/, {
                                wallet_balance: i.wallet_balance
                            }];
                }
            });
        });
    };
    UsersService.prototype.findAndUpdate = function (i, object) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.update(i, object)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UsersService.prototype.forgotPassword = function (email, newPassword, response) {
        var options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: email,
            subject: 'Reset Password Instructions',
            html: (0, verifyEmail_1.getNewPassword)(newPassword)
        };
        this.transporter.sendMail(options, function (err, info) {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Email sent! ' + info);
        });
        return response.send('Your password has been reset. Check your email!');
        // return response.send(() => requestNewPassword(newPassword));
    };
    UsersService.prototype.resetPassword = function (email, id) {
        var emailToken = this.jwtService.sign({
            id: id
        }, {
            expiresIn: '15m'
        });
        var url = "https://canza-api-6dbce.ondigitalocean.app/" + helpers_1.API_VERSION + "reset/" + emailToken;
        var options = {
            from: this.configService.get('EMAIL_SMTP_ADDRESS'),
            to: email,
            subject: 'Reset Password Instructions',
            html: (0, verifyEmail_1.requestNewPassword)(url)
        };
        this.transporter.sendMail(options, function (err, info) {
            if (err)
                return common_1.Logger.log('Email Error: ' + err);
            common_1.Logger.log('Email sent! ' + info);
        });
    };
    UsersService.prototype.upload = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var originalname, bucketS3, name, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalname = file.originalname;
                        bucketS3 = this.configService.get('AWS_S3_BUCKET_NAME');
                        name = originalname.trim().replace(/ /g, '');
                        return [4 /*yield*/, this.uploadS3(file.buffer, bucketS3, name)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data['Location']];
                }
            });
        });
    };
    UsersService.prototype.uploadS3 = function (file, bucket, name) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, params;
            return __generator(this, function (_a) {
                s3 = this.getS3();
                params = {
                    Bucket: bucket,
                    Key: String(name),
                    Body: file
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        s3.upload(params, function (err, data) {
                            if (err) {
                                common_1.Logger.error(err);
                                reject(err.message);
                            }
                            resolve(data);
                        });
                    })];
            });
        });
    };
    UsersService.prototype.getS3 = function () {
        return new aws_sdk_1.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
        });
    };
    UsersService.prototype.validateUser = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, id, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        jwt = auth.replace('Bearer ', '');
                        id = this.jwtService.verify(jwt).id;
                        return [4 /*yield*/, this.usersRepository.findOne({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Unauthorized');
                        }
                        return [2 /*return*/, user];
                    case 2:
                        err_1 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.validateAdmin = function (auth) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, id, user, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        jwt = auth.replace('Bearer ', '');
                        id = this.jwtService.verify(jwt).id;
                        return [4 /*yield*/, this.usersRepository.findOne({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (user && user.role > 2) {
                            return [2 /*return*/, user];
                        }
                        else {
                            throw new common_1.UnauthorizedException('Unauthorized');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        throw new common_1.UnauthorizedException('Unauthorized');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getMyContacts = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, ids, data, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.contactsRepository.find({ userId: id })];
                    case 1:
                        res = _a.sent();
                        ids = __spreadArray([], new Set(res.map(function (item) { return item.contact_id; })), true);
                        return [4 /*yield*/, this.usersRepository.findByIds(ids)];
                    case 2:
                        data = _a.sent();
                        result = data
                            ? data.map(function (i) {
                                return {
                                    id: i.id,
                                    email: i.email,
                                    verified: i.verified,
                                    firstname: i.firstname,
                                    lastname: i.lastname,
                                    location: i.location,
                                    image_url: i.image_url,
                                    phone: i.phone,
                                    banned: i.banned
                                };
                            })
                            : [];
                        return [2 /*return*/, result];
                    case 3:
                        err_3 = _a.sent();
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.addContact = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.contactsRepository.save(object)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, object];
                    case 2:
                        err_4 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.deleteContact = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.contactsRepository["delete"](object)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_5 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.Contacts))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
