import { HttpStatus, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { AppError } from '@common/helpers/app-error';
import { detectImageMime } from '@infrastructure/storage/image-signature.helper';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { ProcessedImageVariant } from '@domain/types/processed-image.type';
import { ALLOWED_IMAGE_MIMES, IMAGE_VARIANT_SPECS, MAX_INPUT_PIXELS, MAX_UPLOAD_BYTES } from '@domain/constants/upload.constant';

@Injectable()
export class ImageProcessorService {
  async process(buffer: Buffer | undefined): Promise<ProcessedImageVariant[]> {
    if (!buffer || buffer.length === 0) throw new AppError(ErrorCode.ImageMissing, 'Image file is required', HttpStatus.BAD_REQUEST);
    if (buffer.length > MAX_UPLOAD_BYTES) throw new AppError(ErrorCode.ImageTooLarge, 'Image is too large', HttpStatus.PAYLOAD_TOO_LARGE);
    const mime = detectImageMime(buffer);
    if (!mime || !ALLOWED_IMAGE_MIMES.includes(mime)) {
      throw new AppError(ErrorCode.ImageInvalidType, 'Only JPEG, PNG and WebP images are accepted', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    try {
      return await Promise.all(
        IMAGE_VARIANT_SPECS.map(async (spec) => ({
          name: spec.name,
          buffer: await sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS })
            .rotate()
            .resize({ width: spec.width, withoutEnlargement: true })
            .webp({ quality: spec.quality })
            .toBuffer(),
        })),
      );
    } catch {
      throw new AppError(ErrorCode.ImageCorrupt, 'Image could not be processed', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
