import { Injectable, Inject } from '@nestjs/common';
import { PRODUCT_INJECT_TOKEN } from '@domain/tokens/inject.token';
import { CreateProductCommand } from '@application/commands/export-all.commands';
import { ApplicationProductMapper } from '@application/mappers/product.mapper';
import { ProductEntity } from '@domain/entities/product.entity';
import { ProductRepository } from '@domain/repositories/product.repository';

@Injectable()
export class CreateProductUseCase {
  constructor(@Inject(PRODUCT_INJECT_TOKEN) private readonly productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const product = ApplicationProductMapper.toEntity(command);
    return this.productRepository.create(product);
  }
}
