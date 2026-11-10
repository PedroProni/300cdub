const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46];
const WEBP_SIGNATURE = [0x57, 0x45, 0x42, 0x50];
const WEBP_OFFSET = 8;

function startsWith(buffer: Buffer, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) return false;
  return signature.every((byte, index) => buffer[offset + index] === byte);
}

export function detectImageMime(buffer: Buffer): string | null {
  if (startsWith(buffer, JPEG_SIGNATURE)) return 'image/jpeg';
  if (startsWith(buffer, PNG_SIGNATURE)) return 'image/png';
  if (startsWith(buffer, RIFF_SIGNATURE) && startsWith(buffer, WEBP_SIGNATURE, WEBP_OFFSET)) return 'image/webp';
  return null;
}
