import { Injectable } from '@nestjs/common';
import { StorageService } from '@infrastructure/storage/storage.service';
import { CategoryRecord, ProductRecord } from '@domain/types/records.type';
import { CategoryRef, ProductView } from '@domain/types/product-view.type';
import { CategoryView } from '@domain/types/category-view.type';
import { StockStatus } from '@domain/enums/stock-status.enum';
import { ImageVariantName } from '@domain/enums/image-variant-name.enum';
import { LAST_UNITS_THRESHOLD } from '@domain/constants/catalog.constant';

@Injectable()
export class ProductViewMapper {
  constructor(private readonly storage: StorageService) {}

  toCategoryView(record: CategoryRecord): CategoryView {
    return { id: String(record._id), slug: record.slug, name: record.name, sortOrder: record.sortOrder };
  }

  toCategoryMap(records: CategoryRecord[]): Map<string, CategoryRef> {
    return new Map(records.map((record) => [String(record._id), { id: String(record._id), slug: record.slug, name: record.name }]));
  }

  toView(record: ProductRecord, categories: Map<string, CategoryRef>): ProductView {
    const totalStock = record.variants.reduce((sum, variant) => sum + variant.stock, 0);
    return {
      id: String(record._id),
      slug: record.slug,
      name: record.name,
      description: record.description ?? '',
      category: record.categoryId ? (categories.get(String(record.categoryId)) ?? null) : null,
      price: record.price,
      promoPrice: record.promoPrice ?? null,
      images: record.images.map((image, index) => ({
        id: image.id,
        isCover: index === 0,
        urls: {
          thumb: this.storage.publicUrl(image.baseKey, ImageVariantName.Thumb),
          medium: this.storage.publicUrl(image.baseKey, ImageVariantName.Medium),
          large: this.storage.publicUrl(image.baseKey, ImageVariantName.Large),
        },
      })),
      variants: record.variants.map((variant) => ({ id: String(variant._id), label: variant.label, stock: variant.stock })),
      totalStock,
      stockStatus: this.stockStatus(totalStock),
      featured: record.featured,
      visible: record.visible,
      sortOrder: record.sortOrder,
      createdAt: record.createdAt,
    };
  }

  private stockStatus(totalStock: number): StockStatus {
    if (totalStock <= 0) return StockStatus.SoldOut;
    if (totalStock <= LAST_UNITS_THRESHOLD) return StockStatus.LastUnits;
    return StockStatus.InStock;
  }
}
