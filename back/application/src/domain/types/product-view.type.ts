import { StockStatus } from '@domain/enums/stock-status.enum';
import { ProductImageView } from '@domain/types/product-image-view.type';

export type CategoryRef = { id: string; slug: string; name: string };

export type VariantView = { id: string; label: string; stock: number };

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategoryRef | null;
  price: number;
  promoPrice: number | null;
  images: ProductImageView[];
  variants: VariantView[];
  totalStock: number;
  stockStatus: StockStatus;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: Date;
};
