import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from '@common/helpers/app-error';
import { uniqueSlug } from '@common/helpers/slug.helper';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { ProductView } from '@domain/types/product-view.type';
import { ProductInput } from '@domain/types/product-write.type';
import { ProductRecord } from '@domain/types/records.type';
import { ProductSort } from '@domain/enums/product-sort.enum';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { MAX_REORDER_IDS, NO_MATCH_CATEGORY_ID } from '@domain/constants/catalog.constant';

@Injectable()
export class ProductService {
  constructor(
    private readonly products: ProductRepository,
    private readonly categories: CategoryRepository,
    private readonly storage: StorageService,
    private readonly mapper: ProductViewMapper,
  ) {}

  async listAll(search?: string, categorySlug?: string): Promise<ProductView[]> {
    const category = categorySlug ? await this.categories.findBySlug(categorySlug) : null;
    const { items } = await this.products.list({
      onlyVisible: false,
      categoryId: categorySlug ? (category ? String(category._id) : NO_MATCH_CATEGORY_ID) : undefined,
      search,
      sort: ProductSort.Manual,
      skip: 0,
      limit: MAX_REORDER_IDS,
    });
    return this.toViews(items);
  }

  async get(id: string): Promise<ProductView> {
    const record = await this.products.findById(id);
    if (!record) throw this.notFound();
    return (await this.toViews([record]))[0];
  }

  async create(input: ProductInput): Promise<ProductView> {
    await this.assertValid(input);
    const slug = await uniqueSlug(input.name, (candidate) => this.products.slugExists(candidate));
    const created = await this.products.create(input, slug, await this.products.nextSortOrder());
    return (await this.toViews([created]))[0];
  }

  async update(id: string, input: ProductInput): Promise<ProductView> {
    await this.assertValid(input);
    const current = await this.products.findById(id);
    if (!current) throw this.notFound();
    const slug = current.name === input.name ? current.slug : await uniqueSlug(input.name, (candidate) => this.products.slugExists(candidate, id));
    const updated = await this.products.update(id, input, slug);
    if (!updated) throw this.notFound();
    return (await this.toViews([updated]))[0];
  }

  async remove(id: string): Promise<void> {
    if (!(await this.products.delete(id))) throw this.notFound();
    await this.storage.deleteByPrefix(`products/${id}/`);
  }

  async reorder(ids: string[]): Promise<void> {
    const { items } = await this.products.list({ onlyVisible: false, sort: ProductSort.Manual, skip: 0, limit: MAX_REORDER_IDS });
    const existing = items.map((record) => String(record._id));
    if (existing.length !== ids.length || !ids.every((id) => existing.includes(id))) {
      throw new AppError(ErrorCode.ReorderMismatch, 'Ids do not match the existing products', HttpStatus.BAD_REQUEST);
    }
    await this.products.setOrder(ids);
  }

  async toViews(records: ProductRecord[]): Promise<ProductView[]> {
    const categories = this.mapper.toCategoryMap(await this.categories.findAll());
    return records.map((record) => this.mapper.toView(record, categories));
  }

  private async assertValid(input: ProductInput): Promise<void> {
    if (input.promoPrice !== null && input.promoPrice !== undefined && input.promoPrice >= input.price) {
      throw new AppError(ErrorCode.ValidationFailed, 'Promotional price must be lower than the price', HttpStatus.BAD_REQUEST);
    }
    if (input.categoryId && !(await this.categories.findById(input.categoryId))) {
      throw new AppError(ErrorCode.CategoryNotFound, 'Category not found', HttpStatus.BAD_REQUEST);
    }
    const labels = input.variants.map((variant) => variant.label.toLowerCase());
    if (new Set(labels).size !== labels.length) {
      throw new AppError(ErrorCode.ValidationFailed, 'Variant labels must be unique', HttpStatus.BAD_REQUEST);
    }
  }

  private notFound(): AppError {
    return new AppError(ErrorCode.NotFound, 'Product not found', HttpStatus.NOT_FOUND);
  }
}
