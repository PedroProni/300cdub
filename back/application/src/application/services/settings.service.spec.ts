import { SettingsService } from '@application/services/settings.service';
import { SettingsRepository } from '@infrastructure/database/repositories/settings.repository';
import { DEFAULT_CONTACT_SETTINGS } from '@domain/constants/settings.constant';

const VALUES = { instagramHandle: '300c.dub', whatsappNumber: '5511999999999', messageTemplate: 'Oi {product}' };

describe('SettingsService', () => {
  it('returns the defaults when nothing is stored', async () => {
    const service = new SettingsService({ find: jest.fn().mockResolvedValue(null) } as unknown as SettingsRepository);
    expect(await service.get()).toEqual(DEFAULT_CONTACT_SETTINGS);
  });

  it('returns only the contact fields of the stored document', async () => {
    const service = new SettingsService({ find: jest.fn().mockResolvedValue({ ...VALUES, _id: 'x', __v: 0 }) } as unknown as SettingsRepository);
    expect(await service.get()).toEqual(VALUES);
  });

  it('saves and returns the saved contact fields', async () => {
    const save = jest.fn().mockResolvedValue({ ...VALUES, _id: 'x' });
    const service = new SettingsService({ save } as unknown as SettingsRepository);
    expect(await service.save(VALUES)).toEqual(VALUES);
    expect(save).toHaveBeenCalledWith(VALUES);
  });
});
