import { ArrayMaxSize, ArrayUnique, IsArray, IsMongoId } from 'class-validator';
import { MAX_REORDER_IDS } from '@domain/constants/catalog.constant';

export class ReorderDto {
  @IsArray() @ArrayMaxSize(MAX_REORDER_IDS) @ArrayUnique() @IsMongoId({ each: true }) ids!: string[];
}
