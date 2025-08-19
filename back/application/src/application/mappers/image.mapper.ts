import { ImageEntity } from '@domain/entities/image.entity';

export class ApplicationImageMapper {
  static toEntity(data: any): ImageEntity {
    return new ImageEntity({
      image_url: data.image_url,
      position: data.position,
    });
  }
}
