import { ProductEntity } from "@domain/entities/product.entity";

export interface ProductRepository {
    create(entity: ProductEntity): Promise<ProductEntity>;
    find(page: number, limit: number, id?: string): Promise<ProductEntity[]>;
    update(entity: ProductEntity): Promise<ProductEntity>;
    delete(id: string): Promise<void>;
}