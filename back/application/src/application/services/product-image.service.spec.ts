import { errorWithCode } from '@application/services/error-code.matcher';
import { ProductImageService } from '@application/services/product-image.service';
import { ProductService } from '@application/services/product.service';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { ImageProcessorService } from '@infrastructure/storage/image-processor.service';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { MAX_IMAGES_PER_PRODUCT } from '@domain/constants/upload.constant';

function images(ids: string[]) {
  return ids.map((id) => ({ id, baseKey: `products/p1/${id}` }));
}

function build(current: { _id: string; images: { id: string; baseKey: string }[] } | null = { _id: 'p1', images: images(['a', 'b']) }) {
  const products = {
    findById: jest.fn().mockResolvedValue(current),
    pushImage: jest.fn().mockImplementation(async (_id: string, image: { id: string; baseKey: string }) => ({ _id: 'p1', images: [...(current?.images ?? []), image] })),
    pullImage: jest.fn().mockResolvedValue(current),
    setImages: jest.fn().mockImplementation(async (_id: string, list: unknown[]) => ({ _id: 'p1', images: list })),
  };
  const processor = { process: jest.fn().mockResolvedValue([{ name: 'thumb' }]) };
  const storage = { putVariants: jest.fn().mockResolvedValue(undefined), deleteByPrefix: jest.fn().mockResolvedValue(undefined) };
  const productService = { toViews: jest.fn().mockImplementation(async (records: { images: { id: string }[] }[]) => [{ imageIds: records[0].images.map((i) => i.id) }]) };
  const service = new ProductImageService(
    products as unknown as ProductRepository,
    processor as unknown as ImageProcessorService,
    storage as unknown as StorageService,
    productService as unknown as ProductService,
  );
  return { service, products, processor, storage };
}

describe('ProductImageService', () => {
  it('stores the processed variants and pushes the image', async () => {
    const { service, storage, products } = build();
    const view = (await service.add('p1', Buffer.from('x'))) as unknown as { imageIds: string[] };
    expect(storage.putVariants).toHaveBeenCalledTimes(1);
    expect(products.pushImage).toHaveBeenCalledTimes(1);
    expect(view.imageIds).toHaveLength(3);
  });

  it('refuses an upload past the limit before processing the file', async () => {
    const full = images(Array.from({ length: MAX_IMAGES_PER_PRODUCT }, (_, i) => `i${i}`));
    const { service, processor } = build({ _id: 'p1', images: full });
    await expect(service.add('p1', Buffer.from('x'))).rejects.toMatchObject(errorWithCode(ErrorCode.ImageLimitReached));
    expect(processor.process).not.toHaveBeenCalled();
  });

  it('cleans the stored files when a concurrent upload took the last slot', async () => {
    const { service, products, storage } = build();
    products.pushImage.mockResolvedValue(null);
    await expect(service.add('p1', Buffer.from('x'))).rejects.toMatchObject(errorWithCode(ErrorCode.ImageLimitReached));
    expect(storage.deleteByPrefix).toHaveBeenCalledTimes(1);
  });

  it('fails to add to a missing product', async () => {
    await expect(build(null).service.add('p1', Buffer.from('x'))).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
  });

  it('removes an image and its files, and fails for unknown image or product', async () => {
    const { service, products, storage } = build();
    const view = (await service.remove('p1', 'a')) as unknown as { imageIds: string[] };
    expect(storage.deleteByPrefix).toHaveBeenCalledWith('products/p1/a/');
    expect(view.imageIds).toEqual(['b']);
    await expect(service.remove('p1', 'zzz')).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
    products.pullImage.mockResolvedValue(null);
    await expect(service.remove('p1', 'a')).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
  });

  it('reorders images and rejects a mismatching id list', async () => {
    const { service, products } = build();
    const view = (await service.reorder('p1', ['b', 'a'])) as unknown as { imageIds: string[] };
    expect(view.imageIds).toEqual(['b', 'a']);
    expect(products.setImages).toHaveBeenCalledTimes(1);
    await expect(service.reorder('p1', ['a'])).rejects.toMatchObject(errorWithCode(ErrorCode.ReorderMismatch));
  });

  it('moves the chosen cover to the first position', async () => {
    const { service } = build();
    const view = (await service.setCover('p1', 'b')) as unknown as { imageIds: string[] };
    expect(view.imageIds).toEqual(['b', 'a']);
    await expect(service.setCover('p1', 'zzz')).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
  });
});
