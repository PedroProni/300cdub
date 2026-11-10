import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/features/admin/products/products-admin.constants";

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "errors.fileType";
  if (file.size > MAX_IMAGE_BYTES) return "errors.fileTooLarge";
  return null;
}
