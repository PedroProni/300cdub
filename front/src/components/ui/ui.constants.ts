import type { ButtonVariant } from "@/components/ui/ui.types";
import type { StockStatus } from "@/types/product.types";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent-fill text-black hover:bg-accent border border-accent-fill hover:border-accent",
  secondary: "bg-raised text-steel hover:bg-edge border border-edge",
  ghost: "bg-transparent text-steel hover:bg-raised border border-transparent",
  danger: "bg-transparent text-danger hover:bg-danger/15 border border-danger/50",
};

export const PRODUCT_GRID_CLASS = "grid grid-flow-dense grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4";

export const FEATURED_CELL_CLASS = "col-span-2 lg:row-span-2";

export const STOCK_BADGE_KEYS: Record<StockStatus, string> = {
  in_stock: "stock.inStock",
  last_units: "stock.lastUnits",
  sold_out: "stock.soldOut",
};

export const STOCK_BADGE_CLASSES: Record<StockStatus, string> = {
  in_stock: "text-ok border-ok/50",
  last_units: "text-warn border-warn/50",
  sold_out: "text-danger border-danger/50",
};

export const IMAGE_VARIANT_WIDTHS = { thumb: 240, medium: 720, large: 1600 } as const;
