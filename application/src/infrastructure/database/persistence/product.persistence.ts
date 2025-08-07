import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductRepository } from '@domain/repositories/product.repository';
import { Product, ProductDocument } from '@infrastructure/database/schemas/product.schema';
import { ProductEntity } from '@domain/entities/product.entity';
import { DomainProductMapper } from '@domain/mappers/product.mapper';

@Injectable()
export class ProductPersistence implements ProductRepository {
  private readonly logger = new Logger(ProductPersistence.name);

  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  // Main methods
  async create(entity: ProductEntity): Promise<ProductEntity> {
    try {
      const persistence_product = DomainProductMapper.toPersistence(entity);
      const created_product = await this.productModel.create(persistence_product);
      return DomainProductMapper.toDomain(created_product);
    } catch (error) {
      this.logger.error('Error creating product:', error);
      throw error;
    }
  }

  async find(page: number, limit: number, id?: string): Promise<ProductEntity[]> {
    try {
      const query: any = {};

      if (id) {
        query['_id'] = id;
      }

      const products = await this.productModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ updated_at: -1 })
        .exec();

      return products.map(DomainProductMapper.toDomain);
    } catch (error) {
      this.logger.error('Error finding products:', error);
      throw error;
    }
  }

  async update(entity: ProductEntity): Promise<ProductEntity> {
    try {
      const persistence_product = DomainProductMapper.toPersistence(entity);
      const updated_product = await this.productModel.findByIdAndUpdate(persistence_product._id, persistence_product, { new: true }).exec();
      return DomainProductMapper.toDomain(updated_product);
    } catch (error) {
      this.logger.error('Error updating product:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.productModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error('Error deleting product:', error);
      throw error;
    }
  }

  // Auxiliary methods
}
