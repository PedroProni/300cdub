import { IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { INSTAGRAM_HANDLE_PATTERN, MAX_MESSAGE_TEMPLATE_LENGTH } from '@domain/constants/settings.constant';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const stripHandle = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().replace(/^@/, '') : value);
const digitsOnly = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.replace(/[\s()+-]/g, '') : value);

export class SettingsDto {
  @Transform(stripHandle) @IsString() @Matches(INSTAGRAM_HANDLE_PATTERN) instagramHandle!: string;
  @Transform(digitsOnly) @IsString() @Matches(/^(\d{8,15})?$/) whatsappNumber!: string;
  @Transform(trim) @IsString() @MaxLength(MAX_MESSAGE_TEMPLATE_LENGTH) messageTemplate!: string;
}
