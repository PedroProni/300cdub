// Product
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';

export default [CreateProductUseCase, FindProductUseCase, UpdateProductUseCase, DeleteProductUseCase];
