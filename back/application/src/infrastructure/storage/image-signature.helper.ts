import { JPEG_SIGNATURE, PNG_SIGNATURE, RIFF_SIGNATURE, WEBP_SIGNATURE, WEBP_OFFSET } from '@domain/constants/image-signature.constant';

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
