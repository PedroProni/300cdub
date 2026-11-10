export type VariantInput = { label: string; stock: number };

export type ProductInput = {
  name: string;
  description: string;
  categoryId: string | null;
  price: number;
  promoPrice: number | null;
  variants: VariantInput[];
  visible: boolean;
  featured: boolean;
};
