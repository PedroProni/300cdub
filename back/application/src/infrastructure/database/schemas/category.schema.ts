import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'categories', timestamps: true })
export class Category {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, unique: true }) slug!: string;
  @Prop({ required: true, default: 0, index: true }) sortOrder!: number;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);
