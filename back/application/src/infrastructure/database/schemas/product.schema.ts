import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Image } from '@infrastructure/database/schemas/image.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, versionKey: false, collection: 'product' })
export class Product {
    @Prop({ required: true })
    _id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true })
    category!: string;

    @Prop({ required: true })
    images!: Image[];

    @Prop({ required: true })
    created_at!: Date;

    @Prop({ required: true })
    updated_at!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);