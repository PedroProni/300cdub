import { ProductEntity } from '@domain/entities/product.entity';
import { DomainImageMapper } from '@domain/mappers/image.mapper';

export class DomainProductMapper {
  static toPersistence(entity: ProductEntity): any {
    return {
      _id: entity.getId(),
      name: entity.getName(),
      description: entity.getDescription(),
      price: entity.getPrice(),
      category: entity.getCategory(),
      images: entity.getImages().map(image => DomainImageMapper.toPersistence(image)),
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
    };
  }

  static toDomain(raw: any): ProductEntity {
    return new ProductEntity({
      _id: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price,
      category: raw.category,
      images: raw.images.map((image: any) => DomainImageMapper.toDomain(image)),
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }
}
