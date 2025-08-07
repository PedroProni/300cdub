import { v4 as uuidv4 } from 'uuid';
import { ImageEntity } from './image.entity';

export class ProductEntity {
  private readonly _id: string;
  private name: string;
  private description?: string;
  private price: number;
  private category: string;
  private images: ImageEntity[];
  private readonly created_at: Date;
  private readonly updated_at: Date;

  constructor(props: { _id?: string; name: string; description?: string; price: number; category: string; images: ImageEntity[]; created_at?: Date; updated_at?: Date }) {
    this._id = props._id || uuidv4();
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.category = props.category;
    this.images = props.images;
    this.created_at = props.created_at || new Date();
    this.updated_at = props.updated_at || new Date();
  }

  // Getters
  getId(): string {
    return this._id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getCategory(): string {
    return this.category;
  }

  getImages(): ImageEntity[] {
    return this.images;
  }

  getCreatedAt(): Date {
    return this.created_at;
  }

  getUpdatedAt(): Date {
    return this.updated_at;
  }
}
