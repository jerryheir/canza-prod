import { IsNotEmpty } from 'class-validator';

export class LocationCreateDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  country: string;
}
