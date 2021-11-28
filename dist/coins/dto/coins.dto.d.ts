import { Supported } from '../../interfaces';
export declare class SupportedCoinsDto {
    type: Supported;
    image_url: string;
    coin_name: string;
}
export declare class CoinsDto {
    amount: number;
}
export declare class CreateSwapDto {
    from: number;
    to: number;
    amount: number;
}
export declare class SendCoinDto {
    amount: number;
    supported_coin_id: number;
    to: string;
}
