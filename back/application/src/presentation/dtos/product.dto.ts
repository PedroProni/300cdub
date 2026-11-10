import { ArrayMaxSize, IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { VariantDto } from '@presentation/dtos/variant.dto';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_PRICE, MAX_VARIANTS } from '@domain/constants/catalog.constant';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class ProductDto {
  @Transform(trim) @IsString() @MinLength(1) @MaxLength(MAX_NAME_LENGTH) name!: string;
  @Transform(trim) @IsString() @MaxLength(MAX_DESCRIPTION_LENGTH) description!: string;
  @IsOptional() @IsMongoId() categoryId!: string | null;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @Max(MAX_PRICE) price!: number;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01) @Max(MAX_PRICE) promoPrice!: number | null;
  @IsArray() @ArrayMaxSize(MAX_VARIANTS) @ValidateNested({ each: true }) @Type(() => VariantDto) variants!: VariantDto[];
  @IsBoolean() visible!: boolean;
  @IsBoolean() featured!: boolean;
}
