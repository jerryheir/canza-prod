import { Request } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { responseData } from '../interfaces';
import { CoinsService } from './coins.service';
import { CreateSwapDto, SendCoinDto, SupportedCoinsDto } from './dto/coins.dto';
import { Currencies } from './currencies';
export declare class CoinsController {
    private readonly coinsService;
    private readonly notificationsService;
    private readonly currencies;
    constructor(coinsService: CoinsService, notificationsService: NotificationsService, currencies: Currencies);
    getCoins(request: Request, currency: string): Promise<responseData>;
    getSwapRate(primary: string, coins: string): Promise<responseData>;
    getCoinGeckoCurrencies(): Promise<responseData>;
    getSupportedCoins(currency?: string): Promise<responseData>;
    deleteSupportedCoin(id: number): Promise<responseData>;
    createSupportedCoins(request: Request, supportedCoins: SupportedCoinsDto): Promise<responseData>;
    updateSupportedCoins(request: Request, supported_coin_id: number, supportedCoins: SupportedCoinsDto): Promise<responseData>;
    requestSwapToken(request: Request, createSwapDto: CreateSwapDto): Promise<responseData>;
    sendCoin(request: Request, sendCoin: SendCoinDto): Promise<responseData>;
}
