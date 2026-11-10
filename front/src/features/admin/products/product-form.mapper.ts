import type { ProductFormState } from "@/features/admin/products/products-admin.types";
import type { Product, ProductInput } from "@/types/product.types";

export function emptyProductForm(): ProductFormState {
  return { name: "", description: "", categoryId: "", price: null, promoPrice: null, variants: [], visible: true, featured: false };
}

export function toProductForm(product: Product): ProductFormState {
  return {
    name: product.name,
    description: product.description,
    categoryId: product.category?.id ?? "",
    price: product.price,
    promoPrice: product.promoPrice,
    variants: product.variants.map((variant) => ({ label: variant.label, stock: variant.stock })),
    visible: product.visible,
    featured: product.featured,
  };
}

export function toProductInput(product: Product): ProductInput {
  return formToInput(toProductForm(product));
}

export function formToInput(form: ProductFormState): ProductInput {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    categoryId: form.categoryId === "" ? null : form.categoryId,
    price: form.price ?? 0,
    promoPrice: form.promoPrice,
    variants: form.variants.map((variant) => ({ label: variant.label.trim(), stock: Number(variant.stock) })),
    visible: form.visible,
    featured: form.featured,
  };
}
