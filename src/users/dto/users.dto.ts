import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}

export class LoginDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
