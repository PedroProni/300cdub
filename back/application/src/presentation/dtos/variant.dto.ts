import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { MAX_STOCK, MAX_VARIANT_LABEL_LENGTH } from '@domain/constants/catalog.constant';

export class VariantDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_VARIANT_LABEL_LENGTH)
  label!: string;

  @IsInt() @Min(0) @Max(MAX_STOCK) stock!: number;
}
