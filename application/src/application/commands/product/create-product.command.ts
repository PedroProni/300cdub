import { ImageEntity } from '@domain/entities/image.entity';

export class CreateProductCommand {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly category: string,
    public readonly images: ImageEntity[],
    public readonly created_at: string,
    public readonly updated_at: string,
  ) {}
}
