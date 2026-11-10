import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductSort } from '@domain/enums/product-sort.enum';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MAX_SEARCH_LENGTH } from '@domain/constants/catalog.constant';

export class ProductListQueryDto {
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @Transform(({ value }) => value === 'true' || value === true ? true : value === 'false' || value === false ? false : value) @IsBoolean() featured?: boolean;
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)) @IsString() @MaxLength(MAX_SEARCH_LENGTH) search?: string;
  @IsOptional() @IsEnum(ProductSort) sort: ProductSort = ProductSort.Manual;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(10_000) page: number = DEFAULT_PAGE;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(MAX_LIMIT) limit: number = DEFAULT_LIMIT;
}
