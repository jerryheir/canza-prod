import { Repository } from 'typeorm';
import { Coins, SupportedCoins } from './coins.entity';
import { Currencies } from './currencies';
export declare class CoinsService {
    private readonly coinsRepository;
    private readonly supCoinsRepository;
    private readonly currencies;
    constructor(coinsRepository: Repository<Coins>, supCoinsRepository: Repository<SupportedCoins>, currencies: Currencies);
    findSupportedCoinsAll(currency: string[]): Promise<any[]>;
    getSwapRate(primary: string, coins: string[]): Promise<Array<{
        currency: string;
        value: number;
    }>>;
    getCoinGeckoCurrencies(): Promise<any>;
    findMyCoins(object: any): Promise<Coins[]>;
    findOneCoin(object: any): Promise<Coins>;
    createSupportedCoin(object: any): Promise<Coins[]>;
    deleteSupportedCoin(object: any): Promise<import("typeorm").DeleteResult>;
    updateSupportedCoin(supported_coin_id: number, object: any): Promise<void>;
    getOneSupportedCoin(object: any): Promise<SupportedCoins>;
    addMyCoin(object: any): Promise<any>;
    updateMyCoin(coin_id: number, object: any): Promise<import("typeorm").UpdateResult>;
}
