import { ImageVariantName } from '@domain/enums/image-variant-name.enum';

export type ProcessedImageVariant = {
  name: ImageVariantName;
  buffer: Buffer;
};
