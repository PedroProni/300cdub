import type { ProductSort } from "@/types/product.types";

export const CATALOG_PAGE_SIZE = 12;

export const HOME_FEATURED_LIMIT = 9;

export const DEFAULT_SORT: ProductSort = "manual";

export const SORT_OPTIONS: { value: ProductSort; labelKey: string }[] = [
  { value: "manual", labelKey: "catalog.sort.manual" },
  { value: "newest", labelKey: "catalog.sort.newest" },
  { value: "price_asc", labelKey: "catalog.sort.priceAsc" },
  { value: "price_desc", labelKey: "catalog.sort.priceDesc" },
];

export const PRODUCT_CARD_SIZES = "(min-width: 1024px) 320px, 50vw";

export const FEATURED_CARD_SIZES = "(min-width: 1024px) 640px, 100vw";

export const EAGER_CARD_COUNT = 4;

export const LOAD_MORE_ROOT_MARGIN = "400px";
