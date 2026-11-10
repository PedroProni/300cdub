import { onBeforeUnmount, toValue, watchEffect } from "vue";
import { DEFAULT_DESCRIPTION_META, DEFAULT_TITLE, HEAD_META_SELECTORS } from "@/composables/useHead.constants";
import type { HeadInput } from "@/composables/useHead.types";

function setMeta(selector: string, attribute: string, key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function applyHead(title: string, description: string): void {
  document.title = title;
  setMeta(HEAD_META_SELECTORS.description, "name", "description", description);
  setMeta(HEAD_META_SELECTORS.ogTitle, "property", "og:title", title);
  setMeta(HEAD_META_SELECTORS.ogDescription, "property", "og:description", description);
}

export function useHead(input: HeadInput): void {
  watchEffect(() => applyHead(toValue(input.title), toValue(input.description) ?? ""));
  onBeforeUnmount(() => applyHead(DEFAULT_TITLE, DEFAULT_DESCRIPTION_META));
}
