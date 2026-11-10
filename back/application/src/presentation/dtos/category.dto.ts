import { IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MAX_NAME_LENGTH } from '@domain/constants/catalog.constant';

export class CategoryDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_NAME_LENGTH)
  name!: string;
}
