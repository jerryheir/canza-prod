import { Currency } from '../../interfaces';
export declare class CreateOrderDto {
    buy_type: 1 | 2;
    supported_coin_id: number;
    amount: number;
    location_id?: number;
    request_amount: number;
    bank_name?: string;
    account_number?: string;
}
export declare class UpdateOrderDto {
    resolved_by: number;
    amount_resolved_at: number;
    currency_resolved_at: Currency;
    address?: string;
    agent_address: string;
    bank_name?: string;
    account_number?: string;
}
