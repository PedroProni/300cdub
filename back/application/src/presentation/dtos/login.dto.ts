import { IsEmail, IsString, MaxLength } from 'class-validator';
import { PASSWORD_MAX_LENGTH } from '@domain/constants/auth.constant';

export class LoginDto {
  @IsEmail() @MaxLength(254) email!: string;
  @IsString() @MaxLength(PASSWORD_MAX_LENGTH) password!: string;
}
