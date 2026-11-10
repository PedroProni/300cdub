import { errorWithCode } from '@application/services/error-code.matcher';
import { CategoryService } from '@application/services/category.service';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { CategoryRepository } from '@infrastructure/database/repositories/category.repository';
import { ProductRepository } from '@infrastructure/database/repositories/product.repository';
import { ErrorCode } from '@domain/enums/error-code.enum';

function record(id: string, name: string) {
  return { _id: id, name, slug: name.toLowerCase(), sortOrder: 0 };
}

function build(existing = [record('c1', 'Camisetas'), record('c2', 'Bonés')]) {
  const categories = {
    findAll: jest.fn().mockResolvedValue(existing),
    slugExists: jest.fn().mockResolvedValue(false),
    nextSortOrder: jest.fn().mockResolvedValue(2),
    create: jest.fn().mockImplementation(async (name: string, slug: string) => ({ ...record('c3', name), slug })),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(true),
    setOrder: jest.fn().mockResolvedValue(undefined),
  };
  const products = { clearCategory: jest.fn().mockResolvedValue(undefined) };
  const mapper = { toCategoryView: (r: { _id: string; name: string; slug: string }) => ({ id: String(r._id), name: r.name, slug: r.slug }) };
  const service = new CategoryService(categories as unknown as CategoryRepository, products as unknown as ProductRepository, mapper as unknown as ProductViewMapper);
  return { service, categories, products };
}

describe('CategoryService', () => {
  it('lists categories as views', async () => {
    const { service } = build();
    expect((await service.list()).map((c) => c.name)).toEqual(['Camisetas', 'Bonés']);
  });

  it('creates a category with a generated slug and the next sort order', async () => {
    const { service, categories } = build();
    const view = await service.create('Novidades');
    expect(categories.create).toHaveBeenCalledWith('Novidades', 'novidades', 2);
    expect(view.id).toBe('c3');
  });

  it('removing a category detaches its products first and fails when it does not exist', async () => {
    const { service, categories, products } = build();
    await service.remove('c1');
    expect(products.clearCategory).toHaveBeenCalledWith('c1');
    categories.delete.mockResolvedValue(false);
    await expect(service.remove('zzz')).rejects.toMatchObject(errorWithCode(ErrorCode.CategoryNotFound));
  });

  it('throws not found when updating a missing category', async () => {
    await expect(build().service.update('zzz', 'Outro')).rejects.toMatchObject(errorWithCode(ErrorCode.CategoryNotFound));
  });

  it('reorders only with the exact set of existing ids', async () => {
    const { service, categories } = build();
    await service.reorder(['c2', 'c1']);
    expect(categories.setOrder).toHaveBeenCalledWith(['c2', 'c1']);
    await expect(service.reorder(['c1'])).rejects.toMatchObject(errorWithCode(ErrorCode.ReorderMismatch));
    await expect(service.reorder(['c1', 'x'])).rejects.toMatchObject(errorWithCode(ErrorCode.ReorderMismatch));
  });
});
