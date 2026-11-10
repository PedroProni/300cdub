import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'admins', timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email!: string;
  @Prop({ required: true }) passwordHash!: string;
  @Prop({ required: true, default: () => new Date() }) passwordChangedAt!: Date;
}

export type AdminDocument = HydratedDocument<Admin>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
