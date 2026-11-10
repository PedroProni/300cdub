import type { ProductFormErrors } from "@/features/admin/products/products-admin.types";
import type { ProductInput } from "@/types/product.types";

export function validateProductInput(input: ProductInput): ProductFormErrors {
  const errors: ProductFormErrors = {};
  if (input.name.trim().length < 2) errors.name = "admin.products.errors.name";
  if (!Number.isFinite(input.price) || input.price <= 0) errors.price = "admin.products.errors.price";
  if (input.promoPrice !== null && (!Number.isFinite(input.promoPrice) || input.promoPrice <= 0 || input.promoPrice >= input.price)) {
    errors.promoPrice = "admin.products.errors.promoPrice";
  }
  const labels = input.variants.map((variant) => variant.label.trim().toLowerCase());
  if (labels.some((label) => label === "")) errors.variants = "admin.products.errors.variantLabel";
  else if (new Set(labels).size !== labels.length) errors.variants = "admin.products.errors.variantDuplicate";
  else if (input.variants.some((variant) => !Number.isInteger(variant.stock) || variant.stock < 0)) errors.variants = "admin.products.errors.variantStock";
  return errors;
}

export function hasErrors(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
