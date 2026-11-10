import { Module } from '@nestjs/common';
import { StorageModule } from '@infrastructure/storage/storage.module';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { AdminSeedService } from '@application/services/admin-seed.service';
import { AuthService } from '@application/services/auth.service';
import { CategoryService } from '@application/services/category.service';
import { ProductImageService } from '@application/services/product-image.service';
import { ProductService } from '@application/services/product.service';
import { PublicCatalogService } from '@application/services/public-catalog.service';
import { SettingsService } from '@application/services/settings.service';
import { SharePageService } from '@application/services/share-page.service';

const services = [ProductViewMapper, AdminSeedService, AuthService, CategoryService, ProductImageService, ProductService, PublicCatalogService, SettingsService, SharePageService];

@Module({ imports: [StorageModule], providers: services, exports: services })
export class ApplicationModule {}
