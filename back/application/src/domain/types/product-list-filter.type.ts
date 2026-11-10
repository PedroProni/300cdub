import { ProductSort } from '@domain/enums/product-sort.enum';

export type ProductListFilter = {
  onlyVisible: boolean;
  categoryId?: string | null;
  featured?: boolean;
  search?: string;
  sort: ProductSort;
  skip: number;
  limit: number;
};
