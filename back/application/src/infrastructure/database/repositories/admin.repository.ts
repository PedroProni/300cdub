import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '@infrastructure/database/schemas/admin.schema';
import { AdminRecord } from '@domain/types/records.type';

@Injectable()
export class AdminRepository {
  constructor(@InjectModel(Admin.name) private readonly model: Model<Admin>) {}

  findByEmail(email: string): Promise<AdminRecord | null> {
    return this.model.findOne({ email }).lean<AdminRecord>().exec();
  }

  findById(id: string): Promise<AdminRecord | null> {
    return this.model.findById(id).lean<AdminRecord>().exec();
  }

  count(): Promise<number> {
    return this.model.estimatedDocumentCount().exec();
  }

  async create(email: string, passwordHash: string): Promise<void> {
    await this.model.create({ email, passwordHash, passwordChangedAt: new Date() });
  }

  async updatePassword(id: string, passwordHash: string): Promise<Date> {
    const passwordChangedAt = new Date();
    await this.model.updateOne({ _id: id }, { passwordHash, passwordChangedAt }).exec();
    return passwordChangedAt;
  }
}
