import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: false, versionKey: false, _id: false, collection: 'image' })
export class Image {
    @Prop({ required: true })
    image_url!: string;

    @Prop({ required: true })
    position!: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);