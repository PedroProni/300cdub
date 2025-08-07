import { ImageEntity } from '@domain/entities/image.entity';

export class DomainImageMapper {
  static toPersistence(entity: ImageEntity): any {
    return {
      image_url: entity.getImageUrl(),
      position: entity.getPosition(),
    };
  }

  static toDomain(raw: any): ImageEntity {
    return new ImageEntity({
      image_url: raw.image_url,
      position: raw.position,
    });
  }
}
