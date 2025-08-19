import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageEntity } from '@domain/entities/image.entity';

export class UpdateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Sample Product' })
  @IsOptional()
  @IsString()
  readonly name!: string;

  @ApiProperty({ description: 'The description of the product', example: 'This is a sample product.' })
  @IsOptional()
  @IsString()
  readonly description!: string;

  @ApiProperty({ description: 'The price of the product', example: 9.99 })
  @IsOptional()
  @IsNumber()
  readonly price!: number;

  @ApiProperty({ description: 'The category of the product', example: 'Electronics' })
  @IsOptional()
  @IsString()
  readonly category!: string;

  @ApiProperty({ description: 'The images associated with the product', type: [ImageEntity], example: [{ image_url: 'http://example.com/image.jpg', position: 1 }] })
  @IsOptional()
  @Type(() => ImageEntity)
  readonly images!: ImageEntity[];
}
