import sharp from 'sharp';
import { ImageProcessorService } from '@infrastructure/storage/image-processor.service';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { MAX_UPLOAD_BYTES } from '@domain/constants/upload.constant';

const service = new ImageProcessorService();

function codeOf(promise: Promise<unknown>): Promise<unknown> {
  return promise.then(
    () => null,
    (error: { getResponse: () => { code: string } }) => error.getResponse().code,
  );
}

describe('ImageProcessorService', () => {
  it('produces three webp variants no wider than the spec', async () => {
    const source = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: '#aa0000' } }).jpeg().toBuffer();
    const variants = await service.process(source);
    const widths = await Promise.all(variants.map(async (variant) => (await sharp(variant.buffer).metadata()).width));
    expect(variants.map((variant) => variant.name)).toEqual(['thumb', 'medium', 'large']);
    expect(widths).toEqual([240, 720, 1600]);
  });

  it('does not enlarge small images', async () => {
    const source = await sharp({ create: { width: 100, height: 100, channels: 3, background: '#000' } }).png().toBuffer();
    const widths = await Promise.all((await service.process(source)).map(async (variant) => (await sharp(variant.buffer).metadata()).width));
    expect(widths).toEqual([100, 100, 100]);
  });

  it('rejects a missing file', async () => {
    expect(await codeOf(service.process(undefined))).toBe(ErrorCode.ImageMissing);
  });

  it('rejects non image content', async () => {
    expect(await codeOf(service.process(Buffer.from('<?php echo 1; ?>')))).toBe(ErrorCode.ImageInvalidType);
  });

  it('rejects a corrupt image with a valid signature', async () => {
    const corrupt = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from('not really a jpeg')]);
    expect(await codeOf(service.process(corrupt))).toBe(ErrorCode.ImageCorrupt);
  });

  it('rejects oversized files', async () => {
    expect(await codeOf(service.process(Buffer.alloc(MAX_UPLOAD_BYTES + 1, 1)))).toBe(ErrorCode.ImageTooLarge);
  });
});
