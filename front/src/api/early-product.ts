import type { Product } from "@/types/product.types";

export async function takeEarlyProduct(slug: string): Promise<Product | null> {
  const early = window.__earlyProduct;
  if (!early || early.slug !== slug) return null;
  window.__earlyProduct = undefined;
  try {
    const response = await early.promise;
    if (!response || !response.ok) return null;
    return (await response.json()) as Product;
  } catch {
    return null;
  }
}
