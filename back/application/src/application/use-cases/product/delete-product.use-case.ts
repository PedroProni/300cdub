import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_INJECT_TOKEN } from '@domain/tokens/inject.token';
import { ProductRepository } from '@domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(@Inject(PRODUCT_INJECT_TOKEN) private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}
