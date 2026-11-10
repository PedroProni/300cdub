import { detectImageMime } from '@infrastructure/storage/image-signature.helper';

describe('detectImageMime', () => {
  it('detects jpeg, png and webp by magic bytes', () => {
    expect(detectImageMime(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]))).toBe('image/jpeg');
    expect(detectImageMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))).toBe('image/png');
    expect(detectImageMime(Buffer.concat([Buffer.from('RIFF'), Buffer.from([1, 2, 3, 4]), Buffer.from('WEBP')]))).toBe('image/webp');
  });

  it('rejects other content even with an image name', () => {
    expect(detectImageMime(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))).toBeNull();
    expect(detectImageMime(Buffer.from('GIF89a'))).toBeNull();
    expect(detectImageMime(Buffer.alloc(0))).toBeNull();
  });
});
