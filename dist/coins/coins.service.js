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
exports.CoinsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("axios");
const coins_entity_1 = require("./coins.entity");
const currencies_1 = require("./currencies");
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3/';
let CoinsService = class CoinsService {
    constructor(coinsRepository, supCoinsRepository, currencies) {
        this.coinsRepository = coinsRepository;
        this.supCoinsRepository = supCoinsRepository;
        this.currencies = currencies;
    }
    async findSupportedCoinsAll(currency) {
        const supported_coins = await this.supCoinsRepository.find();
        const sup_coins = [
            ...new Set(supported_coins.map((item) => item.coin_name)),
        ].join('%2C');
        const curr = currency.join('%2C');
        const info = await (0, axios_1.default)(`${COINGECKO_BASE_URL}simple/price?ids=${sup_coins}&vs_currencies=${curr}&include_24hr_change=true`).then((res) => res.data);
        const data = supported_coins
            .map((item) => {
            const value = info[item.coin_name];
            if (value) {
                const prices = Object.keys(value)
                    .filter((b) => !b.includes('_24h_change'))
                    .map((a) => {
                    return {
                        currency: a,
                        value: value[a],
                        change_24hr: value[`${a}_24h_change`],
                    };
                });
                return Object.assign(Object.assign({}, item), { prices: prices });
            }
        })
            .filter((a) => a);
        return data;
    }
    async getSwapRate(primary, coins) {
        const curr = coins.join('%2C');
        const info = await (0, axios_1.default)(`${COINGECKO_BASE_URL}simple/price?ids=${primary}&vs_currencies=${curr}`).then((res) => res.data);
        const value = info[primary];
        const data = Object.keys(value).map((a) => {
            return {
                currency: a,
                value: value[a],
            };
        });
        return data;
    }
    async getCoinGeckoCurrencies() {
        const data = await (0, axios_1.default)(`${COINGECKO_BASE_URL}simple/supported_vs_currencies`).then((res) => res.data);
        return data;
    }
    async findMyCoins(object) {
        try {
            const coins = await this.coinsRepository.find(object);
            const data = await Promise.all(coins.map(async (item) => {
                const supported = await this.supCoinsRepository.findOne({
                    id: item.supported_coin_id,
                });
                const balance = await this.currencies.getBalance(supported.type, item.address);
                if (balance !== parseFloat(item.amount)) {
                    await this.updateMyCoin(item.id, { amount: balance.toFixed(8) });
                }
                return Object.assign(Object.assign({}, item), { amount: balance, lastBalance: item.amount });
            }));
            return data;
        }
        catch (err) {
            console.log('ERROR MY COINS', err);
        }
    }
    async findOneCoin(object) {
        return await this.coinsRepository.findOne(object);
    }
    async createSupportedCoin(object) {
        return await this.supCoinsRepository.save(object);
    }
    async deleteSupportedCoin(object) {
        return await this.supCoinsRepository.delete(object);
    }
    async updateSupportedCoin(supported_coin_id, object) {
        await this.supCoinsRepository.update({
            id: supported_coin_id,
        }, object);
    }
    async getOneSupportedCoin(object) {
        return await this.supCoinsRepository.findOne(object);
    }
    async addMyCoin(object) {
        return await this.coinsRepository.save(object);
    }
    async updateMyCoin(coin_id, object) {
        try {
            console.log(coin_id, object);
            return await this.coinsRepository.update({
                id: coin_id,
            }, object);
        }
        catch (err) {
            console.log('UPDATE COINS', err);
        }
    }
};
CoinsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coins_entity_1.Coins)),
    __param(1, (0, typeorm_1.InjectRepository)(coins_entity_1.SupportedCoins)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        currencies_1.Currencies])
], CoinsService);
exports.CoinsService = CoinsService;
//# sourceMappingURL=coins.service.js.map