import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionModule } from '@infrastructure/database/connection/mongo-connect.module';
import { EnvConfigModule } from '@common/env/env-config.module';
import { HelperModule } from '@common/helpers/helper.module';
import { ProductPersistence } from '@infrastructure/database/persistence/product.persistence';
import { Product, ProductSchema } from '@infrastructure/database/schemas/product.schema';

const persistences: any = [ProductPersistence];

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), ConnectionModule, EnvConfigModule, HelperModule],
  providers: [...persistences],
  exports: [ConnectionModule, ...persistences],
})
export class DatabaseModule {}
