import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings } from '@infrastructure/database/schemas/settings.schema';
import { ContactSettings } from '@domain/types/contact-settings.type';
import { SETTINGS_SINGLETON_KEY } from '@domain/constants/settings.constant';

@Injectable()
export class SettingsRepository {
  constructor(@InjectModel(Settings.name) private readonly model: Model<Settings>) {}

  find(): Promise<ContactSettings | null> {
    return this.model.findOne({ key: SETTINGS_SINGLETON_KEY }).lean<ContactSettings>().exec();
  }

  save(values: ContactSettings): Promise<ContactSettings> {
    return this.model
      .findOneAndUpdate({ key: SETTINGS_SINGLETON_KEY }, { $set: values }, { upsert: true, new: true })
      .lean<ContactSettings>()
      .exec();
  }
}
