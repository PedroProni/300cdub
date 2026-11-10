import { IsOptional, IsString, MaxLength } from 'class-validator';
import { MAX_SEARCH_LENGTH } from '@domain/constants/catalog.constant';

export class AdminListQueryDto {
  @IsOptional() @IsString() @MaxLength(MAX_SEARCH_LENGTH) search?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
}
