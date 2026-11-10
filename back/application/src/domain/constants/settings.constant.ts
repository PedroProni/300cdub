import { ContactSettings } from '@domain/types/contact-settings.type';

export const SETTINGS_SINGLETON_KEY = 'contact';
export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  instagramHandle: '300c.dub',
  whatsappNumber: '',
  messageTemplate: 'Oi! Tenho interesse na peça {product} no tamanho {size}.',
};
export const MAX_MESSAGE_TEMPLATE_LENGTH = 500;
export const WHATSAPP_NUMBER_PATTERN = /^\d{8,15}$/;
export const INSTAGRAM_HANDLE_PATTERN = /^[A-Za-z0-9._]{1,30}$/;
