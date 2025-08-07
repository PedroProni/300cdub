import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageEntity } from '@domain/entities/image.entity';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Sample Product' })
  @IsString()
  readonly name!: string;

  @ApiProperty({ description: 'The description of the product', example: 'This is a sample product.' })
  @IsString()
  readonly description!: string;

  @ApiProperty({ description: 'The price of the product', example: 9.99 })
  @IsNumber()
  readonly price!: number;

  @ApiProperty({ description: 'The category of the product', example: 'Electronics' })
  @IsString()
  readonly category!: string;

  @ApiProperty({ description: 'The images associated with the product', type: [ImageEntity], example: [{ image_url: 'http://example.com/image.jpg', position: 1 }] })
  @Type(() => ImageEntity)
  readonly images!: ImageEntity[];
}
