import { ImageVariantName } from '@domain/enums/image-variant-name.enum';
import { ImageVariantSpec } from '@domain/types/image-variant-spec.type';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_PRODUCT = 10;
export const ALLOWED_IMAGE_MIMES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp'];
export const UPLOAD_FIELD_NAME = 'file';
export const MAX_INPUT_PIXELS = 40_000_000;
export const IMAGE_VARIANT_SPECS: readonly ImageVariantSpec[] = [
  { name: ImageVariantName.Thumb, width: 240, quality: 78 },
  { name: ImageVariantName.Medium, width: 720, quality: 80 },
  { name: ImageVariantName.Large, width: 1600, quality: 82 },
];
export const IMAGE_OUTPUT_EXTENSION = 'webp';
export const IMAGE_OUTPUT_CONTENT_TYPE = 'image/webp';
export const IMAGE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
