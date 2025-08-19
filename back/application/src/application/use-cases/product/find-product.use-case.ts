import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_INJECT_TOKEN } from '@domain/tokens/inject.token';
import { ProductRepository } from '@domain/repositories/product.repository';
import { ProductEntity } from '@domain/entities/product.entity';

@Injectable()
export class FindProductUseCase {
  constructor(@Inject(PRODUCT_INJECT_TOKEN) private readonly productRepository: ProductRepository) {}

  async execute(page: number, limit: number, id?: string): Promise<ProductEntity[]> {
    return this.productRepository.find(page, limit, id);
  }
}
