"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_dto_1 = require("./dto/users.dto");
const users_service_1 = require("./users.service");
const bcrypt = require("bcryptjs");
const verifyEmail_1 = require("../users/templates/verifyEmail");
const helpers_1 = require("../helpers");
const platform_express_1 = require("@nestjs/platform-express");
const roles_guard_1 = require("../roles.guard");
const transactions_service_1 = require("../transactions/transactions.service");
let UsersController = class UsersController {
    constructor(usersService, jwtService, transactionsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.transactionsService = transactionsService;
    }
    async register(registerDto) {
        try {
            const hashedPassword = await bcrypt.hash(registerDto.password, 12);
            const data = await this.usersService.findOne({
                email: registerDto.email,
            });
            if (data) {
                throw new common_1.BadRequestException('User already exists');
            }
            await this.usersService.registerService(Object.assign(Object.assign({}, registerDto), { password: hashedPassword }));
            return {
                status: 'success',
                message: 'Registration successful',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async registerAgents(registerDto) {
        try {
            const hashedPassword = await bcrypt.hash(registerDto.password, 12);
            const data = await this.usersService.findOne({
                email: registerDto.email,
            });
            if (data) {
                throw new common_1.BadRequestException('Agent already exists');
            }
            await this.usersService.registerService(Object.assign(Object.assign({}, registerDto), { password: hashedPassword, role: 2 }));
            return {
                status: 'success',
                message: 'Agents Registration successful',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async login(loginDto, response) {
        try {
            const user = await this.usersService.findOne({ email: loginDto.email });
            if (!user || (user && user.banned === 1)) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            if (!(await bcrypt.compare(loginDto.password, user.password))) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            if (!user.verified) {
                this.usersService.verifyEmail({ id: user.id, email: user.email });
                return response.status(403).json({
                    status: 'error',
                    message: 'This user has not verified their account. A new email has been sent!',
                });
            }
            const jwt = await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
            });
            response.cookie('x-token', jwt, { httpOnly: true });
            return {
                status: 'success',
                message: 'Log in successful',
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    image_url: user.image_url,
                    wallet_balance: user.wallet_balance,
                    token: jwt,
                },
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async getUser(request) {
        try {
            const user = request['guardUser'];
            return {
                status: 'success',
                message: 'Retrieved successfully',
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    image_url: user.image_url,
                    google_signin: user.google_signin,
                    wallet_balance: user.wallet_balance,
                },
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException();
        }
    }
    async getUsers() {
        const data = await this.usersService.findAll({ role: 2 });
        return {
            status: 'success',
            message: 'All agents fetched successfully',
            data: data,
        };
    }
    async confirm(response, token) {
        try {
            const result = await this.jwtService.verifyAsync(token);
            if (result && result.id) {
                await this.usersService.findAndUpdate({
                    id: result.id,
                }, {
                    verified: true,
                });
                const str = (0, verifyEmail_1.verificationDone)();
                return response.send(str);
            }
            else {
                return response.send('An Error occurred. Please try again later!');
            }
        }
        catch (err) {
            common_1.Logger.log('err', err);
            throw new common_1.UnauthorizedException();
        }
    }
    async requestReset(resetDto) {
        try {
            const user = await this.usersService.findOne({ email: resetDto.email });
            if (!user) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            this.usersService.resetPassword(user.email, user.id);
            return {
                status: 'success',
                message: 'An email has been sent!',
            };
        }
        catch (err) {
            throw new common_1.ForbiddenException('Denied Access!');
        }
    }
    async resetPassword(response, token) {
        try {
            const result = await this.jwtService.verifyAsync(token);
            if (!result)
                return response.send('Reset Password link has expired!');
            const user = await this.usersService.findOne({ id: result.id });
            if (user && user.id) {
                const randomHash = (0, helpers_1.generateRandomHash)(11);
                const hashedPassword = await bcrypt.hash(randomHash, 12);
                const page = await this.usersService.forgotPassword(user.email, randomHash, response);
                await this.usersService.findAndUpdate({ id: user.id }, {
                    password: hashedPassword,
                });
                return page;
            }
            else {
                return response.send('An Error occurred. Please try again later!');
            }
        }
        catch (err) {
            throw new common_1.ForbiddenException('Denied Access!');
        }
    }
    async changePassword(changeDto, response) {
        try {
            const user = await this.usersService.findOne({ email: changeDto.email });
            if (!user) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            if (!(await bcrypt.compare(changeDto.password, user.password))) {
                throw new common_1.BadRequestException('Invalid credentials');
            }
            const hashedPassword = await bcrypt.hash(changeDto.newPassword, 12);
            await this.usersService.findAndUpdate({
                id: user.id,
            }, {
                password: hashedPassword,
            });
            const jwt = await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
            });
            response.cookie('x-token', jwt, { httpOnly: true });
            return {
                status: 'success',
                message: 'Password change successful',
                data: {
                    token: jwt,
                },
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('Something went wrong!');
        }
    }
    async editUser(request, editDto) {
        try {
            const user = request['guardUser'];
            await this.usersService.findAndUpdate({ id: user.id }, Object.assign({}, editDto));
            return {
                status: 'success',
                message: 'Profile updated successfully',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('Something went wrong!');
        }
    }
    async upload(request, file) {
        try {
            const user = request['guardUser'];
            const data = await this.usersService.upload(file);
            await this.usersService.findAndUpdate({ id: user.id }, {
                image_url: data,
            });
            return {
                status: 'success',
                message: 'Photo uploaded successfully',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
    async logout(response) {
        response.clearCookie('x-token');
        return {
            status: 'success',
            message: 'Log out successful',
        };
    }
    async getMyContacts(request) {
        try {
            const user = request['guardUser'];
            const data = await this.usersService.getMyContacts(user.id);
            return {
                status: 'success',
                message: 'Contacts fetched successfully',
                data: data,
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async addContact(request, contactDto) {
        const user = request['guardUser'];
        await this.usersService.addContact({
            userId: user.id,
            contact_id: contactDto.contact_id,
        });
        return {
            status: 'success',
            message: 'Added contact successfully',
        };
    }
    async deleteContact(request, contactDto) {
        const user = request['guardUser'];
        await this.usersService.deleteContact({
            userId: user.id,
            contact_id: contactDto.contact_id,
        });
        return {
            status: 'success',
            message: 'Added deleted successfully',
        };
    }
    async getAUser(query) {
        try {
            if (!query || !query.email)
                throw new common_1.BadRequestException();
            const i = await this.usersService.findOne({ email: query.email });
            const data = {
                id: i.id,
                email: i.email,
                firstname: i.firstname,
                lastname: i.lastname,
                image_url: i.image_url,
                phone: i.phone,
            };
            return {
                status: 'success',
                message: 'User fetched successfully',
                data: data,
            };
        }
        catch (err) {
            throw new common_1.ForbiddenException('Denied Access!');
        }
    }
    async getAgents() {
        try {
            const data = await this.usersService.findAll({ role: 2 });
            return {
                status: 'success',
                message: 'Agents fetched successfully',
                data: data.filter((i) => i.banned === 0),
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async fundWallet(request, fundWalletDto) {
        try {
            const user = request['guardUser'];
            if (!fundWalletDto || !fundWalletDto.amount) {
                throw new common_1.BadRequestException();
            }
            await this.usersService.findAndUpdate({ id: user.id }, { wallet_balance: user.wallet_balance + fundWalletDto.amount });
            await this.transactionsService.createTransactions({
                userId: user.id,
                type: 'credit',
                description: `You have just funded your wallet with NGN ${fundWalletDto.amount}`,
                metadata: JSON.stringify({
                    type: 'credit',
                    amount: fundWalletDto.amount,
                }),
            });
            return {
                status: 'success',
                message: 'User fetched successfully',
                data: {
                    wallet_balance: user.wallet_balance + fundWalletDto.amount,
                },
            };
        }
        catch (err) {
            throw new common_1.ForbiddenException('Denied Access!');
        }
    }
    async withdraw(request, fundWalletDto) {
        try {
            const user = request['guardUser'];
            if (!fundWalletDto ||
                !fundWalletDto.amount ||
                user.wallet_balance - fundWalletDto.amount < 0) {
                throw new common_1.BadRequestException();
            }
            if (user.wallet_balance - fundWalletDto.amount >= 0) {
                await this.usersService.findAndUpdate({ id: user.id }, { wallet_balance: user.wallet_balance - fundWalletDto.amount });
                await this.transactionsService.createTransactions({
                    userId: user.id,
                    type: 'debit',
                    description: `You have successfully requested a withdrawal of NGN ${fundWalletDto.amount} from your Canza Wallet`,
                    metadata: JSON.stringify({
                        type: 'debit',
                        amount: fundWalletDto.amount,
                    }),
                });
                return {
                    status: 'success',
                    message: 'Withdraw process successfully',
                    data: {
                        wallet_balance: user.wallet_balance - fundWalletDto.amount,
                    },
                };
            }
            else {
                return {
                    status: 'error',
                    message: 'Withdraw process failed. Try again later.',
                };
            }
        }
        catch (err) {
            throw new common_1.ForbiddenException('Denied Access!');
        }
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('register/agents'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.AgentsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerAgents", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users/me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('users/agents'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('confirmation_code/:token'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)('request-reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Get)('reset/:token'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)('edit-profile'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.EditProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "editUser", null);
__decorate([
    (0, common_1.Post)('profile-picture'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('contacts/me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyContacts", null);
__decorate([
    (0, common_1.Post)('contacts/add'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addContact", null);
__decorate([
    (0, common_1.Delete)('contacts'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteContact", null);
__decorate([
    (0, common_1.Get)('users/get'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAUser", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAgents", null);
__decorate([
    (0, common_1.Put)('fund-wallet'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.FundWalletDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "fundWallet", null);
__decorate([
    (0, common_1.Put)('withdraw'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.FundWalletDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "withdraw", null);
UsersController = __decorate([
    (0, common_1.Controller)(`${helpers_1.API_VERSION}`),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        transactions_service_1.TransactionsService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map