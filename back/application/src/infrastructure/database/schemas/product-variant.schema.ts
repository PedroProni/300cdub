import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ProductVariant {
  @Prop({ required: true, trim: true }) label!: string;
  @Prop({ required: true, min: 0 }) stock!: number;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
