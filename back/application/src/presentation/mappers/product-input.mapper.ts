import { ProductDto } from '@presentation/dtos/product.dto';
import { ProductInput } from '@domain/types/product-write.type';

export function toProductInput(dto: ProductDto): ProductInput {
  return {
    name: dto.name,
    description: dto.description,
    categoryId: dto.categoryId ?? null,
    price: dto.price,
    promoPrice: dto.promoPrice ?? null,
    variants: dto.variants.map((variant) => ({ label: variant.label, stock: variant.stock })),
    visible: dto.visible,
    featured: dto.featured,
  };
}
