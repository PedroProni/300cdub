import type { ButtonVariant } from "@/components/ui/ui.types";
import type { StockStatus } from "@/types/product.types";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-black hover:bg-accent-hot border border-accent",
  secondary: "bg-raised text-steel hover:bg-edge border border-edge",
  ghost: "bg-transparent text-steel hover:bg-raised border border-transparent",
  danger: "bg-transparent text-danger hover:bg-danger/15 border border-danger/50",
};

export const STOCK_BADGE_KEYS: Record<StockStatus, string> = {
  in_stock: "stock.inStock",
  last_units: "stock.lastUnits",
  sold_out: "stock.soldOut",
};

export const STOCK_BADGE_CLASSES: Record<StockStatus, string> = {
  in_stock: "bg-ok/15 text-ok border-ok/40",
  last_units: "bg-warn/15 text-warn border-warn/40",
  sold_out: "bg-danger/15 text-danger border-danger/40",
};

export const IMAGE_VARIANT_WIDTHS = { thumb: 240, medium: 720, large: 1600 } as const;
