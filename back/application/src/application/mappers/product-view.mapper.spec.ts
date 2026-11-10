import { Types } from 'mongoose';
import { ProductViewMapper } from '@application/mappers/product-view.mapper';
import { StorageService } from '@infrastructure/storage/storage.service';
import { ProductRecord } from '@domain/types/records.type';
import { StockStatus } from '@domain/enums/stock-status.enum';

const storage = { publicUrl: (key: string, variant: string) => `https://cdn.test/${key}/${variant}.webp` } as unknown as StorageService;
const mapper = new ProductViewMapper(storage);

function record(stocks: number[], overrides: Partial<ProductRecord> = {}): ProductRecord {
  return {
    _id: new Types.ObjectId(),
    name: 'Camiseta',
    slug: 'camiseta',
    description: '',
    categoryId: null,
    price: 100,
    promoPrice: null,
    images: [{ id: 'a', baseKey: 'products/1/a' }, { id: 'b', baseKey: 'products/1/b' }],
    variants: stocks.map((stock, index) => ({ _id: new Types.ObjectId(), label: `V${index}`, stock })),
    visible: true,
    featured: false,
    sortOrder: 0,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('ProductViewMapper stock status', () => {
  it.each([
    [[0, 0], StockStatus.SoldOut],
    [[], StockStatus.SoldOut],
    [[1, 2], StockStatus.LastUnits],
    [[3], StockStatus.LastUnits],
    [[2, 2], StockStatus.InStock],
    [[10], StockStatus.InStock],
  ])('stocks %j gives %s', (stocks, expected) => {
    expect(mapper.toView(record(stocks), new Map()).stockStatus).toBe(expected);
  });

  it('marks only the first image as cover and builds urls', () => {
    const view = mapper.toView(record([5]), new Map());
    expect(view.images.map((image) => image.isCover)).toEqual([true, false]);
    expect(view.images[0].urls.thumb).toBe('https://cdn.test/products/1/a/thumb.webp');
  });
});
