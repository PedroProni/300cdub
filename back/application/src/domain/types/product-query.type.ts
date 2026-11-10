import { ProductSort } from '@domain/enums/product-sort.enum';

export type ProductQuery = {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sort: ProductSort;
  page: number;
  limit: number;
  onlyVisible: boolean;
};
