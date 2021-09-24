import { IsNotEmpty } from 'class-validator';
import { Currency } from '../../interfaces';

export class CreateOrderDto {
  @IsNotEmpty()
  post_type: number;
  @IsNotEmpty()
  buy_type: 1 | 2; // 1 for buy and 2 for sell
  @IsNotEmpty()
  supported_coin_id: number;
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  location_id: number;
  @IsNotEmpty()
  request_amount: number;
}

export class UpdateOrderDto {
  @IsNotEmpty()
  resolved_by: number;
  @IsNotEmpty()
  amount_resolved_at: number;
  @IsNotEmpty()
  currency_resolved_at: Currency;
}
