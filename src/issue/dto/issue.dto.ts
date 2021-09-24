import { IsNotEmpty, IsEmail } from 'class-validator';

export class IssueDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  description: string;
}
