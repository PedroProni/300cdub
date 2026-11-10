import { IsString, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@domain/constants/auth.constant';

export class ChangePasswordDto {
  @IsString() @MaxLength(PASSWORD_MAX_LENGTH) currentPassword!: string;
  @IsString() @MinLength(PASSWORD_MIN_LENGTH) @MaxLength(PASSWORD_MAX_LENGTH) newPassword!: string;
}
