import { describe, expect, it } from "vitest";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";
import { SORT_LABEL_MAX_LENGTH, SORT_OPTIONS } from "@/features/catalog/catalog.constants";

const sortKeys = SORT_OPTIONS.map((option) => option.labelKey.replace("catalog.sort.", ""));

describe("catalog sort labels", () => {
  it.each([
    ["pt", pt.catalog.sort],
    ["en", en.catalog.sort],
  ])("keeps every %s label short enough for the mobile select", (_lang, labels) => {
    const record = labels as Record<string, string>;
    for (const key of sortKeys) {
      expect(record[key], key).toBeTruthy();
      expect(record[key].length, `${key}: ${record[key]}`).toBeLessThanOrEqual(SORT_LABEL_MAX_LENGTH);
    }
  });
});
