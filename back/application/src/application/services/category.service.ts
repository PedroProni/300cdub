import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from '@common/helpers/app-error';
import { uniqueSlug } from '@common/helpers/slug.helper';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { CategoryView } from '@domain/types/category-view.type';
import { ErrorCode } from '@domain/enums/error-code.enum';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly products: ProductRepository,
    private readonly mapper: ProductViewMapper,
  ) {}

  async list(): Promise<CategoryView[]> {
    return (await this.categories.findAll()).map((record) => this.mapper.toCategoryView(record));
  }

  async create(name: string): Promise<CategoryView> {
    const slug = await uniqueSlug(name, (candidate) => this.categories.slugExists(candidate));
    const created = await this.categories.create(name, slug, await this.categories.nextSortOrder());
    return this.mapper.toCategoryView(created);
  }

  async update(id: string, name: string): Promise<CategoryView> {
    const slug = await uniqueSlug(name, (candidate) => this.categories.slugExists(candidate, id));
    const updated = await this.categories.update(id, name, slug);
    if (!updated) throw this.notFound();
    return this.mapper.toCategoryView(updated);
  }

  async remove(id: string): Promise<void> {
    await this.products.clearCategory(id);
    if (!(await this.categories.delete(id))) throw this.notFound();
  }

  async reorder(ids: string[]): Promise<void> {
    const existing = (await this.categories.findAll()).map((record) => String(record._id));
    if (existing.length !== ids.length || !ids.every((id) => existing.includes(id))) {
      throw new AppError(ErrorCode.ReorderMismatch, 'Ids do not match the existing categories', HttpStatus.BAD_REQUEST);
    }
    await this.categories.setOrder(ids);
  }

  private notFound(): AppError {
    return new AppError(ErrorCode.CategoryNotFound, 'Category not found', HttpStatus.NOT_FOUND);
  }
}
