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
exports.CoinsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("../notifications/notifications.service");
const helpers_1 = require("../helpers");
const roles_guard_1 = require("../roles.guard");
const coins_service_1 = require("./coins.service");
const coins_dto_1 = require("./dto/coins.dto");
const currencies_1 = require("./currencies");
let CoinsController = class CoinsController {
    constructor(coinsService, notificationsService, currencies) {
        this.coinsService = coinsService;
        this.notificationsService = notificationsService;
        this.currencies = currencies;
    }
    async getCoins(request, currency) {
        try {
            const c = currency ? currency.split(',') : [];
            const user = request['guardUser'];
            const curr = c && c.length > 0 ? c : ['ngn'];
            const my_coins = await this.coinsService.findMyCoins({ userId: user.id });
            const supported_coins = await this.coinsService.findSupportedCoinsAll(curr);
            const data = my_coins.map((item) => {
                const sup = supported_coins.find((a) => a.id === item.supported_coin_id);
                return Object.assign(Object.assign({}, sup), item);
            });
            return {
                status: 'success',
                message: 'All Supported Coins',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async getSwapRate(primary, coins) {
        try {
            const c = coins ? coins.split(',') : [];
            const data = await this.coinsService.getSwapRate(primary, c);
            return {
                status: 'success',
                message: 'Swap rates returned successfully',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async getCoinGeckoCurrencies() {
        try {
            const data = await this.coinsService.getCoinGeckoCurrencies();
            return {
                status: 'success',
                message: 'Currency formats returned successfully',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async getSupportedCoins(currency) {
        try {
            const c = currency ? currency.split(',') : [];
            const curr = c && c.length > 0 ? c : ['ngn', 'usd', 'gbp'];
            const data = await this.coinsService.findSupportedCoinsAll(curr);
            return {
                status: 'success',
                message: 'All Supported Coins',
                data: data,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async deleteSupportedCoin(id) {
        try {
            await this.coinsService.deleteSupportedCoin({ id });
            return {
                status: 'success',
                message: 'Deleted supported coins successfully',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async createSupportedCoins(request, supportedCoins) {
        try {
            const user = request['guardUser'];
            const supported = await this.coinsService.getOneSupportedCoin({
                type: supportedCoins.type,
            });
            if (!supported && user.role && user.role > 2) {
                await this.coinsService.createSupportedCoin(supportedCoins);
                return {
                    status: 'success',
                    message: 'Coin successfully added!',
                };
            }
            else {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async updateSupportedCoins(request, supported_coin_id, supportedCoins) {
        try {
            const user = request['guardUser'];
            if (user.role && user.role > 2) {
                await this.coinsService.updateSupportedCoin(supported_coin_id, supportedCoins);
                return {
                    status: 'success',
                    message: 'Coin updated successfully!',
                };
            }
            else {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.UnauthorizedException('Unauthorized');
        }
    }
    async requestSwapToken(request, createSwapDto) {
        try {
            const result = await this.currencies.sendCrypto('btc', {
                from: '18whDyhMyewqKvEG1Gs9jqYUvvhyRS1m4d',
                to: '1oi9BgdZ4Uoa4wuy7NsnDpXbGo5qrY3Vh',
                privateKey: 'Kz28adW7buwdMmjareiP7vou3YSMYpyyoJ78Z6sRwiub8bxPAecR',
                amount: '0.00052816',
            });
            console.log('RESULT OF SEND BTC', result);
            return {
                status: 'error',
                message: 'Something went wrong. Please check your canza wallet and try again',
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('An error occurred!');
        }
    }
    async sendCoin(request, sendCoin) {
        try {
            const user = request['guardUser'];
            const myCoin = await this.coinsService.findOneCoin({
                userId: user.id,
                supported_coin_id: sendCoin.supported_coin_id,
            });
            if (!myCoin || (myCoin && parseFloat(myCoin.amount) < sendCoin.amount)) {
                throw new common_1.BadRequestException('Insufficient assets. Check your assets and try again');
            }
            const supported = await this.coinsService.getOneSupportedCoin({
                supported_coin_id: sendCoin.supported_coin_id,
            });
            this.currencies.sendCrypto(supported.type, {
                from: myCoin.address,
                to: sendCoin.to,
                amount: `${sendCoin.amount}`,
                privateKey: myCoin.private_key,
            });
            return {
                status: 'success',
                message: `Asset sent successfully`,
            };
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException();
        }
    }
};
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getCoins", null);
__decorate([
    (0, common_1.Get)('swap-rate/:primary'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('primary')),
    __param(1, (0, common_1.Query)('coins')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getSwapRate", null);
__decorate([
    (0, common_1.Get)('currencies'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getCoinGeckoCurrencies", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getSupportedCoins", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "deleteSupportedCoin", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, coins_dto_1.SupportedCoinsDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "createSupportedCoins", null);
__decorate([
    (0, common_1.Put)('update/:supported_coin_id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('supported_coin_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, coins_dto_1.SupportedCoinsDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "updateSupportedCoins", null);
__decorate([
    (0, common_1.Put)('request-swap'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, coins_dto_1.CreateSwapDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "requestSwapToken", null);
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, coins_dto_1.SendCoinDto]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "sendCoin", null);
CoinsController = __decorate([
    (0, common_1.Controller)(`${helpers_1.API_VERSION}coins`),
    __metadata("design:paramtypes", [coins_service_1.CoinsService,
        notifications_service_1.NotificationsService,
        currencies_1.Currencies])
], CoinsController);
exports.CoinsController = CoinsController;
//# sourceMappingURL=coins.controller.js.map