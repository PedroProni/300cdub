import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProductImage {
  @Prop({ required: true }) id!: string;
  @Prop({ required: true }) baseKey!: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
