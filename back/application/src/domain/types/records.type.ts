import { Types } from 'mongoose';
import { ProductImage } from '@infrastructure/database/schemas/product-image.schema';

export type VariantRecord = { _id: Types.ObjectId; label: string; stock: number };

export type ProductRecord = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  categoryId: Types.ObjectId | null;
  price: number;
  promoPrice: number | null;
  images: ProductImage[];
  variants: VariantRecord[];
  visible: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type CategoryRecord = { _id: Types.ObjectId; name: string; slug: string; sortOrder: number };

export type AdminRecord = { _id: Types.ObjectId; email: string; passwordHash: string; passwordChangedAt: Date };
