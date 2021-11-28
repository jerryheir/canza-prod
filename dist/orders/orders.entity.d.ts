import { Currency } from '../interfaces';
export declare class Orders {
    id: number;
    userId: number;
    buy_type: 1 | 2;
    supported_coin_id: number;
    amount: number;
    request_amount: number;
    resolved_status: 'created' | 'pending' | 'initiated' | 'confirmed';
    resolved_by: number;
    location_id: number;
    amount_resolved_at: number;
    currency_resolved_at: Currency;
    address?: string;
    agent_address?: string;
    tx_id: string;
    bank_name: string;
    account_number: string;
    created_at: Date;
    updated_at: Date;
}
export declare class SwapToken {
    id: number;
    userId: number;
    from: number;
    to: number;
    amount: number;
    fee: number;
    fee_currency: Currency;
}
