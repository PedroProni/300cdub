import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '@infrastructure/database/schemas/category.schema';
import { CategoryRecord } from '@domain/types/records.type';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category.name) private readonly model: Model<Category>) {}

  findAll(): Promise<CategoryRecord[]> {
    return this.model.find().sort({ sortOrder: 1, _id: 1 }).lean<CategoryRecord[]>().exec();
  }

  findById(id: string): Promise<CategoryRecord | null> {
    return this.model.findById(id).lean<CategoryRecord>().exec();
  }

  findBySlug(slug: string): Promise<CategoryRecord | null> {
    return this.model.findOne({ slug }).lean<CategoryRecord>().exec();
  }

  slugExists(slug: string, ignoreId?: string): Promise<boolean> {
    const filter = ignoreId ? { slug, _id: { $ne: ignoreId } } : { slug };
    return this.model.exists(filter).then(Boolean);
  }

  async nextSortOrder(): Promise<number> {
    const last = await this.model.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean<{ sortOrder: number }>().exec();
    return last ? last.sortOrder + 1 : 0;
  }

  async create(name: string, slug: string, sortOrder: number): Promise<CategoryRecord> {
    const created = await this.model.create({ name, slug, sortOrder });
    return created.toObject() as unknown as CategoryRecord;
  }

  update(id: string, name: string, slug: string): Promise<CategoryRecord | null> {
    return this.model.findByIdAndUpdate(id, { name, slug }, { new: true }).lean<CategoryRecord>().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async setOrder(ids: string[]): Promise<void> {
    await this.model.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { sortOrder: index } } })));
  }
}
