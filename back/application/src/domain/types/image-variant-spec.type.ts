import { ImageVariantName } from '@domain/enums/image-variant-name.enum';

export type ImageVariantSpec = {
  name: ImageVariantName;
  width: number;
  quality: number;
};
