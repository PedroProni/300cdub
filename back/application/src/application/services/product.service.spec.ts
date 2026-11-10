import { errorWithCode } from '@application/services/error-code.matcher';
import { ProductService } from '@application/services/product.service';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ProductInput } from '@domain/types/product-write.type';
import { ErrorCode } from '@domain/enums/error-code.enum';
import { NO_MATCH_CATEGORY_ID } from '@domain/constants/catalog.constant';

const INPUT: ProductInput = { name: 'Camiseta Chrome', description: 'd', categoryId: null, price: 100, promoPrice: null, visible: true, featured: false, variants: [{ label: 'M', stock: 2 }] };

function build() {
  const products = {
    list: jest.fn().mockResolvedValue({ items: [{ _id: 'p1' }, { _id: 'p2' }], total: 2 }),
    findById: jest.fn().mockResolvedValue({ _id: 'p1', name: 'Camiseta Chrome', slug: 'camiseta-chrome' }),
    slugExists: jest.fn().mockResolvedValue(false),
    nextSortOrder: jest.fn().mockResolvedValue(3),
    create: jest.fn().mockResolvedValue({ _id: 'p3' }),
    update: jest.fn().mockResolvedValue({ _id: 'p1' }),
    delete: jest.fn().mockResolvedValue(true),
    setOrder: jest.fn().mockResolvedValue(undefined),
  };
  const categories = { findAll: jest.fn().mockResolvedValue([]), findBySlug: jest.fn().mockResolvedValue(null), findById: jest.fn().mockResolvedValue(null) };
  const storage = { deleteByPrefix: jest.fn().mockResolvedValue(undefined) };
  const mapper = { toCategoryMap: () => new Map(), toView: (record: { _id: string }) => ({ id: String(record._id) }) };
  const service = new ProductService(
    products as unknown as ProductRepository,
    categories as unknown as CategoryRepository,
    storage as unknown as StorageService,
    mapper as unknown as ProductViewMapper,
  );
  return { service, products, categories, storage };
}

describe('ProductService', () => {
  it('creates a product with a unique slug and appended sort order', async () => {
    const { service, products } = build();
    const view = await service.create(INPUT);
    expect(products.create).toHaveBeenCalledWith(INPUT, 'camiseta-chrome', 3);
    expect(view).toEqual({ id: 'p3' });
  });

  it('rejects a promo price that is not lower than the price', async () => {
    const { service, products } = build();
    await expect(service.create({ ...INPUT, promoPrice: 100 })).rejects.toMatchObject(errorWithCode(ErrorCode.ValidationFailed));
    expect(products.create).not.toHaveBeenCalled();
  });

  it('rejects duplicated variant labels ignoring case and unknown categories', async () => {
    const { service } = build();
    await expect(
      service.create({
        ...INPUT,
        variants: [
          { label: 'M', stock: 1 },
          { label: 'm', stock: 1 },
        ],
      }),
    ).rejects.toMatchObject(errorWithCode(ErrorCode.ValidationFailed));
    await expect(service.create({ ...INPUT, categoryId: 'missing' })).rejects.toMatchObject(errorWithCode(ErrorCode.CategoryNotFound));
  });

  it('keeps the slug when the name does not change on update', async () => {
    const { service, products } = build();
    await service.update('p1', INPUT);
    expect(products.update).toHaveBeenCalledWith('p1', INPUT, 'camiseta-chrome');
  });

  it('throws not found when updating or getting a missing product', async () => {
    const { service, products } = build();
    products.findById.mockResolvedValue(null);
    await expect(service.update('zzz', INPUT)).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
    await expect(service.get('zzz')).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
  });

  it('removes the product and its stored images, failing when it does not exist', async () => {
    const { service, products, storage } = build();
    await service.remove('p1');
    expect(storage.deleteByPrefix).toHaveBeenCalledWith('products/p1/');
    products.delete.mockResolvedValue(false);
    storage.deleteByPrefix.mockClear();
    await expect(service.remove('zzz')).rejects.toMatchObject(errorWithCode(ErrorCode.NotFound));
    expect(storage.deleteByPrefix).not.toHaveBeenCalled();
  });

  it('reorders only with the exact set of existing ids', async () => {
    const { service, products } = build();
    await service.reorder(['p2', 'p1']);
    expect(products.setOrder).toHaveBeenCalledWith(['p2', 'p1']);
    await expect(service.reorder(['p1'])).rejects.toMatchObject(errorWithCode(ErrorCode.ReorderMismatch));
  });

  it('filters by a category slug that does not exist to an id that matches nothing', async () => {
    const { service, products } = build();
    await service.listAll(undefined, 'ghost');
    expect(products.list.mock.calls[0][0].categoryId).toBe(NO_MATCH_CATEGORY_ID);
  });
});
