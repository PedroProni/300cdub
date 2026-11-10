import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from '@common/helpers/app-error';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { CategoryView } from '@domain/types/category-view.type';
import { Paginated } from '@domain/types/paginated.type';
import { ProductView } from '@domain/types/product-view.type';
import { ProductQuery } from '@domain/types/product-query.type';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { NO_MATCH_CATEGORY_ID } from '@domain/constants/catalog.constant';

@Injectable()
export class PublicCatalogService {
  constructor(
    private readonly products: ProductRepository,
    private readonly categories: CategoryRepository,
    private readonly mapper: ProductViewMapper,
  ) {}

  async listCategories(): Promise<CategoryView[]> {
    return (await this.categories.findAll()).map((record) => this.mapper.toCategoryView(record));
  }

  async listProducts(query: ProductQuery): Promise<Paginated<ProductView>> {
    const category = query.categorySlug ? await this.categories.findBySlug(query.categorySlug) : null;
    const { items, total } = await this.products.list({
      onlyVisible: true,
      categoryId: query.categorySlug ? (category ? String(category._id) : NO_MATCH_CATEGORY_ID) : undefined,
      featured: query.featured,
      search: query.search,
      sort: query.sort,
      skip: (query.page - 1) * query.limit,
      limit: query.limit,
    });
    const map = this.mapper.toCategoryMap(await this.categories.findAll());
    return { items: items.map((record) => this.mapper.toView(record, map)), total, page: query.page, limit: query.limit };
  }

  async findVisibleBySlug(slug: string): Promise<ProductView | null> {
    const record = await this.products.findBySlug(slug);
    if (!record || !record.visible) return null;
    const map = this.mapper.toCategoryMap(await this.categories.findAll());
    return this.mapper.toView(record, map);
  }

  async getVisibleBySlug(slug: string): Promise<ProductView> {
    const product = await this.findVisibleBySlug(slug);
    if (!product) throw new AppError(ErrorCode.NotFound, 'Product not found', HttpStatus.NOT_FOUND);
    return product;
  }
}
