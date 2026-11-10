import { ArrayMaxSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';
import { MAX_IMAGES_PER_PRODUCT } from '@domain/constants/upload.constant';

export class ReorderImagesDto {
  @IsArray() @ArrayMaxSize(MAX_IMAGES_PER_PRODUCT) @ArrayUnique() @IsUUID('4', { each: true }) ids!: string[];
}
