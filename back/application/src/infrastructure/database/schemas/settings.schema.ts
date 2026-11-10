import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'settings', timestamps: true })
export class Settings {
  @Prop({ required: true, unique: true }) key!: string;
  @Prop({ default: '' }) instagramHandle!: string;
  @Prop({ default: '' }) whatsappNumber!: string;
  @Prop({ default: '' }) messageTemplate!: string;
}

export type SettingsDocument = HydratedDocument<Settings>;
export const SettingsSchema = SchemaFactory.createForClass(Settings);
