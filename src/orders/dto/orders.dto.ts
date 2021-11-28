import { IsNotEmpty, IsOptional } from 'class-validator';
import { Currency } from '../../interfaces';

export class CreateOrderDto {
  @IsNotEmpty()
  buy_type: 1 | 2; // 1 for buy and 2 for sell
  @IsNotEmpty()
  supported_coin_id: number;
  @IsNotEmpty()
  amount: number;
  @IsOptional()
  location_id?: number;
  @IsNotEmpty()
  request_amount: number;
  @IsOptional()
  bank_name?: string;
  @IsOptional()
  account_number?: string;
}

export class UpdateOrderDto {
  @IsNotEmpty()
  resolved_by: number;
  @IsNotEmpty()
  amount_resolved_at: number;
  @IsNotEmpty()
  currency_resolved_at: Currency;
  @IsOptional()
  address?: string;
  @IsOptional()
  agent_address: string;
  @IsOptional()
  bank_name?: string;
  @IsOptional()
  account_number?: string;
}
