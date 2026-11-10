import { API_PUBLIC_ORIGIN } from "@/config/env";
import { INSTAGRAM_DM_BASE, INSTAGRAM_PROFILE_BASE, TEMPLATE_PRODUCT_TOKEN, TEMPLATE_SIZE_TOKEN, WHATSAPP_BASE } from "@/utils/buy-link.constants";

export function fillTemplate(template: string, product: string, size: string): string {
  return template.split(TEMPLATE_PRODUCT_TOKEN).join(product).split(TEMPLATE_SIZE_TOKEN).join(size);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function cleanHandle(handle: string): string {
  return handle.trim().replace(/^@+/, "");
}

export function whatsappUrl(number: string, message: string): string {
  return `${WHATSAPP_BASE}${onlyDigits(number)}?text=${encodeURIComponent(message)}`;
}

export function instagramDmUrl(handle: string): string {
  return `${INSTAGRAM_DM_BASE}${encodeURIComponent(cleanHandle(handle))}`;
}

export function instagramProfileUrl(handle: string): string {
  return `${INSTAGRAM_PROFILE_BASE}${encodeURIComponent(cleanHandle(handle))}`;
}

export function shareUrl(slug: string): string {
  return `${API_PUBLIC_ORIGIN.replace(/\/$/, "")}/p/${encodeURIComponent(slug)}`;
}
