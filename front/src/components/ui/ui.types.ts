import type { ImageUrls } from "@/types/product.types";
import type { StockStatus } from "@/types/product.types";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface BaseButtonProps {
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}

export interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

export interface BaseInputProps extends BaseFieldProps {
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  inputmode?: "text" | "numeric" | "decimal" | "email" | "tel";
  min?: number;
  step?: number;
  required?: boolean;
}

export interface BaseSelectOption {
  value: string;
  label: string;
}

export interface BaseSelectProps extends BaseFieldProps {
  options: BaseSelectOption[];
}

export interface BaseSwitchProps {
  label: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
}

export interface StockBadgeProps {
  status: StockStatus;
}

export interface PriceTagProps {
  price: number;
  promoPrice: number | null;
  large?: boolean;
}

export interface ResponsiveImageProps {
  urls: ImageUrls;
  alt: string;
  sizes: string;
  eager?: boolean;
  priority?: boolean;
  fallbackSrc?: keyof ImageUrls;
  imgClass?: string;
}

export interface SkeletonGridProps {
  count: number;
}

export interface SkeletonListProps {
  count: number;
}

export interface SkeletonFormProps {
  fields: number;
}
