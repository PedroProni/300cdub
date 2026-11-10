import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { ProductImage, ProductImageSchema } from '@infrastructure/database/schemas/product-image.schema';
import { ProductVariant, ProductVariantSchema } from '@infrastructure/database/schemas/product-variant.schema';

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, unique: true }) slug!: string;
  @Prop({ default: '' }) description!: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null, index: true }) categoryId!: Types.ObjectId | null;
  @Prop({ required: true, min: 0 }) price!: number;
  @Prop({ type: Number, default: null }) promoPrice!: number | null;
  @Prop({ type: [ProductImageSchema], default: [] }) images!: ProductImage[];
  @Prop({ type: [ProductVariantSchema], default: [] }) variants!: ProductVariant[];
  @Prop({ default: false, index: true }) visible!: boolean;
  @Prop({ default: false, index: true }) featured!: boolean;
  @Prop({ default: 0, index: true }) sortOrder!: number;
  createdAt!: Date;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
