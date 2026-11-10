import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { Public } from '@infrastructure/security/public.decorator';
import { PublicCatalogService } from '@application/services/public-catalog.service';
import { SettingsService } from '@application/services/settings.service';
import { ProductListQueryDto } from '@presentation/dtos/product-list-query.dto';

@Public()
@Controller('public')
export class PublicController {
  constructor(
    private readonly catalog: PublicCatalogService,
    private readonly settings: SettingsService,
  ) {}

  @Get('settings')
  getSettings() {
    return this.settings.get();
  }

  @Get('categories')
  listCategories() {
    return this.catalog.listCategories();
  }

  @Get('products')
  @Header('Cache-Control', 'public, max-age=30')
  listProducts(@Query() query: ProductListQueryDto) {
    return this.catalog.listProducts({
      categorySlug: query.category,
      featured: query.featured,
      search: query.search,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
      onlyVisible: true,
    });
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.catalog.getVisibleBySlug(slug);
  }
}
