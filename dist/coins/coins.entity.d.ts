import { Supported } from '../interfaces';
export declare class Coins {
    id: number;
    amount: string;
    userId: number;
    supported_coin_id: number;
    private_key: string;
    address: string;
    created_at: Date;
    updated_at: Date;
}
export declare class SupportedCoins {
    id: number;
    type: Supported;
    image_url: string;
    coin_name: string;
}
