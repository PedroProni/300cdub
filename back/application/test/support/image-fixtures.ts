import sharp from 'sharp';

export function jpegFixture(width = 1200, height = 800): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: '#7a0c12' } }).jpeg().toBuffer();
}

export function pngFixture(): Promise<Buffer> {
  return sharp({ create: { width: 64, height: 64, channels: 4, background: '#101010' } }).png().toBuffer();
}
