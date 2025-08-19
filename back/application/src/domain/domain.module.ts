import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { PRODUCT_INJECT_TOKEN } from './tokens/inject.token';
import { ProductPersistence } from '@infrastructure/database/persistence/product.persistence';

const tokens: any = [PRODUCT_INJECT_TOKEN];

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: PRODUCT_INJECT_TOKEN,
      useExisting: ProductPersistence,
    },
  ],
  exports: [...tokens],
})
export class DomainModule {}
