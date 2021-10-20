import { IsNotEmpty } from 'class-validator';
import { Supported } from '../../interfaces';

export class SupportedCoinsDto {
  @IsNotEmpty()
  type: Supported;
  @IsNotEmpty()
  image_url: string;
  @IsNotEmpty()
  coin_name: string;
}

export class CoinsDto {
  @IsNotEmpty()
  amount: number;
  // @IsNotEmpty()
  // supported_coin_id: number;
}

export class CreateSwapDto {
  @IsNotEmpty()
  from: number; // supported_coin_id
  @IsNotEmpty()
  to: number; // supported_coin_id
  @IsNotEmpty()
  amount: number;
}

export class SendCoinDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  supported_coin_id: number;
  @IsNotEmpty()
  to: string;
}
