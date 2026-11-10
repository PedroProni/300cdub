import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '@infrastructure/database/repositories/settings.repository';
import { ContactSettings } from '@domain/types/contact-settings.type';
import { DEFAULT_CONTACT_SETTINGS } from '@domain/constants/settings.constant';

@Injectable()
export class SettingsService {
  constructor(private readonly settings: SettingsRepository) {}

  async get(): Promise<ContactSettings> {
    const stored = await this.settings.find();
    if (!stored) return { ...DEFAULT_CONTACT_SETTINGS };
    return { instagramHandle: stored.instagramHandle, whatsappNumber: stored.whatsappNumber, messageTemplate: stored.messageTemplate };
  }

  async save(values: ContactSettings): Promise<ContactSettings> {
    const saved = await this.settings.save(values);
    return { instagramHandle: saved.instagramHandle, whatsappNumber: saved.whatsappNumber, messageTemplate: saved.messageTemplate };
  }
}
