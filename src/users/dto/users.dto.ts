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

export class ChangePasswordDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly newPassword: string;
}

export class EditProfileDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
}
