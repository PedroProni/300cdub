import { CreateProductCommand, UpdateProductCommand } from '@application/commands/export-all.commands';
import { ApplicationImageMapper } from '@application/mappers/image.mapper';
import { ProductEntity } from '@domain/entities/product.entity';

export class ApplicationProductMapper {
  static toCreateCommand(data: any): CreateProductCommand {
    return new CreateProductCommand(
      data._id,
      data.name,
      data.description,
      data.price,
      data.category,
      data.images ? data.images.map((image: any) => ApplicationImageMapper.toEntity(image)) : [],
      data.created_at,
      data.updated_at,
    );
  }

  static toUpdateCommand(_id: string, data: any): UpdateProductCommand {
    return new UpdateProductCommand(
      _id,
      data.name,
      data.description,
      data.price,
      data.category,
      data.images ? data.images.map((image: any) => ApplicationImageMapper.toEntity(image)) : [],
      data.created_at,
      data.updated_at,
    );
  }

  static toEntity(command: any): ProductEntity {
    return new ProductEntity({
      _id: command._id,
      name: command.name,
      description: command.description,
      price: command.price,
      category: command.category,
      images: command.images ? command.images.map((image: any) => ApplicationImageMapper.toEntity(image)) : [],
      created_at: command.created_at ? new Date(command.created_at) : undefined,
      updated_at: command.updated_at ? new Date(command.updated_at) : undefined,
    });
  }
}
