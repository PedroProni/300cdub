import { HTML_ESCAPES } from '@domain/constants/html.constant';

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}
