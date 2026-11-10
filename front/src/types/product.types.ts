import type { Category } from "@/types/category.types";

export type StockStatus = "in_stock" | "last_units" | "sold_out";

export type ProductSort = "manual" | "price_asc" | "price_desc" | "newest";

export interface ImageUrls {
  thumb: string;
  medium: string;
  large: string;
}

export interface ProductImage {
  id: string;
  isCover: boolean;
  urls: ImageUrls;
}

export interface Variant {
  id: string;
  label: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category | null;
  price: number;
  promoPrice: number | null;
  images: ProductImage[];
  variants: Variant[];
  totalStock: number;
  stockStatus: StockStatus;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface VariantInput {
  label: string;
  stock: number;
}

export interface ProductInput {
  name: string;
  description: string;
  categoryId: string | null;
  price: number;
  promoPrice: number | null;
  variants: VariantInput[];
  visible: boolean;
  featured: boolean;
}

export interface ProductQuery {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
