export type SeedProduct = {
  name: string;
  description: string;
  category: string;
  price: number;
  promoPrice: number | null;
  variants: { label: string; stock: number }[];
  featured: boolean;
  visible: boolean;
  tint: string;
  caption: string;
};
