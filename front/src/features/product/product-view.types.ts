import type { Product, ProductImage, Variant } from "@/types/product.types";

export interface ProductGalleryProps {
  images: ProductImage[];
  alt: string;
}

export interface VariantPickerProps {
  variants: Variant[];
}

export interface ProductPurchaseProps {
  product: Product;
}

export interface SlugProps {
  slug: string;
}
