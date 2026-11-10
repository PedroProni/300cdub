import type { Category } from "@/types/category.types";
import type { Product, ProductSort } from "@/types/product.types";

export interface ProductCardProps {
  product: Product;
  eager?: boolean;
  priority?: boolean;
  featured?: boolean;
}

export interface HeroImageProps {
  product: Product | null;
  loaded: boolean;
}

export interface CategoryChipsProps {
  categories: Category[];
  selected: string;
}

export interface CatalogToolbarProps {
  search: string;
  sort: ProductSort;
}
