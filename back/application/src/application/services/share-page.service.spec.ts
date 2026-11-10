import { SharePageService } from '@application/services/share-page.service';
import { PublicCatalogService } from '@application/services/public-catalog.service';
import { EnvConfigService } from '@common/env/env-config.service';
import { ProductView } from '@domain/types/product-view.type';
import { StockStatus } from '@domain/enums/stock-status.enum';

function product(overrides: Partial<ProductView>): ProductView {
  return {
    id: '1',
    slug: 'camiseta',
    name: 'Camiseta',
    description: 'Algodão premium',
    category: null,
    price: 120,
    promoPrice: null,
    images: [{ id: 'a', isCover: true, urls: { thumb: 't', medium: 'm', large: 'https://cdn.test/a/large.webp' } }],
    variants: [],
    totalStock: 5,
    stockStatus: StockStatus.InStock,
    featured: false,
    visible: true,
    sortOrder: 0,
    createdAt: new Date(),
    ...overrides,
  };
}

function build(found: ProductView | null) {
  const catalog = { findVisibleBySlug: async () => found } as unknown as PublicCatalogService;
  const env = { getSiteUrl: () => 'https://site.test' } as unknown as EnvConfigService;
  return new SharePageService(catalog, env);
}

describe('SharePageService', () => {
  it('renders title with price, cover and redirect', async () => {
    const html = (await build(product({})).render('camiseta')) as string;
    expect(html).toContain('<meta property="og:title" content="Camiseta | R$');
    expect(html).toContain('<meta property="og:image" content="https://cdn.test/a/large.webp">');
    expect(html).toContain('product:price:amount" content="120.00"');
    expect(html).toContain('url=https://site.test/produto/camiseta');
  });

  it('uses the promotional price', async () => {
    const html = (await build(product({ promoPrice: 99.9 })).render('camiseta')) as string;
    expect(html).toContain('content="99.90"');
  });

  it('escapes hostile product text', async () => {
    const html = (await build(product({ name: '"><script>alert(1)</script>', description: '<img src=x onerror=alert(1)>' })).render('camiseta')) as string;
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<img src=x');
  });

  it('returns null for a hidden or missing product', async () => {
    expect(await build(null).render('nope')).toBeNull();
  });
});
