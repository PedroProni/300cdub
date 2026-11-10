import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigService } from '@common/env/env-config.service';
import { Admin, AdminSchema } from '@infrastructure/database/schemas/admin.schema';
import { Category, CategorySchema } from '@infrastructure/database/schemas/category.schema';
import { Product, ProductSchema } from '@infrastructure/database/schemas/product.schema';
import { Settings, SettingsSchema } from '@infrastructure/database/schemas/settings.schema';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { SettingsRepository } from '@infrastructure/database/repositories/settings.repository';

const repositories = [AdminRepository, CategoryRepository, ProductRepository, SettingsRepository];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({ inject: [EnvConfigService], useFactory: (env: EnvConfigService) => ({ uri: env.getMongoUri() }) }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  providers: repositories,
  exports: repositories,
})
export class DatabaseModule {}
