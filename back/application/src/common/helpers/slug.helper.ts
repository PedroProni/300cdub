import slugify from 'slugify';
import { SLUG_FALLBACK } from '@domain/constants/catalog.constant';

export function toSlug(value: string): string {
  const slug = slugify(value, { lower: true, strict: true, trim: true });
  return slug || SLUG_FALLBACK;
}

export async function uniqueSlug(value: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  const base = toSlug(value);
  let candidate = base;
  let suffix = 2;
  while (await exists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
