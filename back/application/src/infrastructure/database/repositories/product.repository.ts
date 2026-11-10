import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';
import { Product } from '@infrastructure/database/schemas/product.schema';
import { ProductImage } from '@infrastructure/database/schemas/product-image.schema';
import { ProductRecord } from '@domain/types/records.type';
import { ProductInput } from '@domain/types/product-write.type';
import { ProductSort } from '@domain/enums/product-sort.enum';
import { escapeRegex } from '@common/helpers/escape-regex.helper';

type ListFilter = {
  onlyVisible: boolean;
  categoryId?: string | null;
  featured?: boolean;
  search?: string;
  sort: ProductSort;
  skip: number;
  limit: number;
};

const SORTS: Record<ProductSort, Record<string, SortOrder>> = {
  [ProductSort.Manual]: { sortOrder: 1, _id: 1 },
  [ProductSort.PriceAsc]: { price: 1, _id: 1 },
  [ProductSort.PriceDesc]: { price: -1, _id: 1 },
  [ProductSort.Newest]: { createdAt: -1, _id: -1 },
};

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private readonly model: Model<Product>) {}

  async list(filter: ListFilter): Promise<{ items: ProductRecord[]; total: number }> {
    const query: FilterQuery<Product> = {};
    if (filter.onlyVisible) query.visible = true;
    if (filter.categoryId !== undefined) query.categoryId = filter.categoryId ? new Types.ObjectId(filter.categoryId) : null;
    if (filter.featured !== undefined) query.featured = filter.featured;
    if (filter.search) query.name = { $regex: escapeRegex(filter.search), $options: 'i' };
    const [items, total] = await Promise.all([
      this.model.find(query).sort(SORTS[filter.sort]).skip(filter.skip).limit(filter.limit).lean<ProductRecord[]>().exec(),
      this.model.countDocuments(query).exec(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<ProductRecord | null> {
    return this.model.findById(id).lean<ProductRecord>().exec();
  }

  findBySlug(slug: string): Promise<ProductRecord | null> {
    return this.model.findOne({ slug }).lean<ProductRecord>().exec();
  }

  slugExists(slug: string, ignoreId?: string): Promise<boolean> {
    const filter = ignoreId ? { slug, _id: { $ne: ignoreId } } : { slug };
    return this.model.exists(filter).then(Boolean);
  }

  async nextSortOrder(): Promise<number> {
    const last = await this.model.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean<{ sortOrder: number }>().exec();
    return last ? last.sortOrder + 1 : 0;
  }

  async create(input: ProductInput, slug: string, sortOrder: number): Promise<ProductRecord> {
    const created = await this.model.create({ ...input, categoryId: input.categoryId, slug, sortOrder });
    return created.toObject() as unknown as ProductRecord;
  }

  update(id: string, input: ProductInput, slug: string): Promise<ProductRecord | null> {
    return this.model.findByIdAndUpdate(id, { $set: { ...input, slug } }, { new: true }).lean<ProductRecord>().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async clearCategory(categoryId: string): Promise<void> {
    await this.model.updateMany({ categoryId: new Types.ObjectId(categoryId) }, { $set: { categoryId: null } }).exec();
  }

  async setOrder(ids: string[]): Promise<void> {
    await this.model.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { sortOrder: index } } })));
  }

  async pushImage(id: string, image: ProductImage, maxImages: number): Promise<ProductRecord | null> {
    const guard = `images.${maxImages - 1}`;
    return this.model
      .findOneAndUpdate({ _id: id, [guard]: { $exists: false } }, { $push: { images: image } }, { new: true })
      .lean<ProductRecord>()
      .exec();
  }

  setImages(id: string, images: ProductImage[]): Promise<ProductRecord | null> {
    return this.model.findByIdAndUpdate(id, { $set: { images } }, { new: true }).lean<ProductRecord>().exec();
  }

  pullImage(id: string, imageId: string): Promise<ProductRecord | null> {
    return this.model.findByIdAndUpdate(id, { $pull: { images: { id: imageId } } }, { new: false }).lean<ProductRecord>().exec();
  }
}
