import type { Product } from "@/types/product.types";

export interface ProductFormState {
  name: string;
  description: string;
  categoryId: string;
  price: number | null;
  promoPrice: number | null;
  variants: { label: string; stock: number }[];
  visible: boolean;
  featured: boolean;
}

export interface ProductFormErrors {
  name?: string;
  price?: string;
  promoPrice?: string;
  variants?: string;
}

export interface ImageManagerProps {
  product: Product;
}

export interface VariantsEditorProps {
  error?: string;
}

export interface ProductEditProps {
  id?: string;
}
