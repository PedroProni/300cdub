import { HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AppError } from '@common/helpers/app-error';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { ImageProcessorService } from '@infrastructure/storage/image-processor.service';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ProductService } from '@application/services/product.service';
import { ProductView } from '@domain/types/product-view.type';
import { ProductRecord } from '@domain/types/records.type';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { MAX_IMAGES_PER_PRODUCT } from '@domain/constants/upload.constant';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly products: ProductRepository,
    private readonly processor: ImageProcessorService,
    private readonly storage: StorageService,
    private readonly productService: ProductService,
  ) {}

  async add(productId: string, file: Buffer | undefined): Promise<ProductView> {
    const current = await this.requireProduct(productId);
    if (current.images.length >= MAX_IMAGES_PER_PRODUCT) throw this.limitReached();
    const variants = await this.processor.process(file);
    const id = randomUUID();
    const baseKey = `products/${productId}/${id}`;
    await this.storage.putVariants(baseKey, variants);
    const updated = await this.products.pushImage(productId, { id, baseKey }, MAX_IMAGES_PER_PRODUCT);
    if (!updated) {
      await this.storage.deleteByPrefix(`${baseKey}/`);
      throw this.limitReached();
    }
    return this.view(updated);
  }

  async remove(productId: string, imageId: string): Promise<ProductView> {
    const before = await this.products.pullImage(productId, imageId);
    if (!before) throw this.productNotFound();
    const image = before.images.find((item) => item.id === imageId);
    if (!image) throw new AppError(ErrorCode.NotFound, 'Image not found', HttpStatus.NOT_FOUND);
    await this.storage.deleteByPrefix(`${image.baseKey}/`);
    return this.view({ ...before, images: before.images.filter((item) => item.id !== imageId) });
  }

  async reorder(productId: string, ids: string[]): Promise<ProductView> {
    const current = await this.requireProduct(productId);
    const known = current.images.map((image) => image.id);
    if (known.length !== ids.length || !ids.every((id) => known.includes(id))) {
      throw new AppError(ErrorCode.ReorderMismatch, 'Ids do not match the product images', HttpStatus.BAD_REQUEST);
    }
    const ordered = ids.map((id) => current.images.find((image) => image.id === id)!);
    return this.view(await this.persist(productId, ordered));
  }

  async setCover(productId: string, imageId: string): Promise<ProductView> {
    const current = await this.requireProduct(productId);
    const cover = current.images.find((image) => image.id === imageId);
    if (!cover) throw new AppError(ErrorCode.NotFound, 'Image not found', HttpStatus.NOT_FOUND);
    const ordered = [cover, ...current.images.filter((image) => image.id !== imageId)];
    return this.view(await this.persist(productId, ordered));
  }

  private async persist(productId: string, images: ProductRecord['images']): Promise<ProductRecord> {
    const updated = await this.products.setImages(productId, images);
    if (!updated) throw this.productNotFound();
    return updated;
  }

  private async requireProduct(productId: string): Promise<ProductRecord> {
    const record = await this.products.findById(productId);
    if (!record) throw this.productNotFound();
    return record;
  }

  private async view(record: ProductRecord): Promise<ProductView> {
    return (await this.productService.toViews([record]))[0];
  }

  private limitReached(): AppError {
    return new AppError(ErrorCode.ImageLimitReached, 'Image limit reached for this product', HttpStatus.CONFLICT);
  }

  private productNotFound(): AppError {
    return new AppError(ErrorCode.NotFound, 'Product not found', HttpStatus.NOT_FOUND);
  }
}
