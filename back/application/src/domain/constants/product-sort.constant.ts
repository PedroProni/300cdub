import { SortOrder } from 'mongoose';
import { ProductSort } from '@domain/enums/product-sort.enum';

export const SORTS: Record<ProductSort, Record<string, SortOrder>> = {
  [ProductSort.Manual]: { sortOrder: 1, _id: 1 },
  [ProductSort.PriceAsc]: { price: 1, _id: 1 },
  [ProductSort.PriceDesc]: { price: -1, _id: 1 },
  [ProductSort.Newest]: { createdAt: -1, _id: -1 },
};
