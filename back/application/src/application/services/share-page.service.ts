import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '@common/env/env-config.service';
import { escapeHtml } from '@common/helpers/escape-html.helper';
import { PublicCatalogService } from '@application/services/public-catalog.service';
import { SharePageData } from '@domain/types/share-page.type';
import { ProductView } from '@domain/types/product-view.type';
import { SHARE_CURRENCY_CODE, SHARE_CURRENCY_LOCALE, SHARE_DESCRIPTION_MAX_LENGTH, SHARE_SITE_NAME, SPA_PRODUCT_PATH } from '@domain/constants/share.constant';

@Injectable()
export class SharePageService {
  constructor(
    private readonly catalog: PublicCatalogService,
    private readonly env: EnvConfigService,
  ) {}

  siteUrl(): string {
    return this.env.getSiteUrl();
  }

  async render(slug: string): Promise<string | null> {
    const product = await this.catalog.findVisibleBySlug(slug);
    return product ? this.html(this.toData(product)) : null;
  }

  private toData(product: ProductView): SharePageData {
    const price = product.promoPrice ?? product.price;
    const formatted = new Intl.NumberFormat(SHARE_CURRENCY_LOCALE, { style: 'currency', currency: SHARE_CURRENCY_CODE }).format(price);
    const description = product.description.replace(/\s+/g, ' ').trim().slice(0, SHARE_DESCRIPTION_MAX_LENGTH);
    const redirectUrl = `${this.env.getSiteUrl()}${SPA_PRODUCT_PATH}/${encodeURIComponent(product.slug)}`;
    return {
      title: `${product.name} | ${formatted}`,
      description: description || `${product.name} - ${SHARE_SITE_NAME}`,
      imageUrl: product.images[0]?.urls.large ?? null,
      canonicalUrl: redirectUrl,
      redirectUrl,
      priceAmount: price.toFixed(2),
      priceCurrency: SHARE_CURRENCY_CODE,
    };
  }

  private html(data: SharePageData): string {
    const e = escapeHtml;
    const image = data.imageUrl ? `<meta property="og:image" content="${e(data.imageUrl)}"><meta name="twitter:image" content="${e(data.imageUrl)}">` : '';
    const card = data.imageUrl ? 'summary_large_image' : 'summary';
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${e(data.title)}</title><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(data.description)}"><link rel="canonical" href="${e(data.canonicalUrl)}"><meta property="og:type" content="product"><meta property="og:site_name" content="${e(SHARE_SITE_NAME)}"><meta property="og:title" content="${e(data.title)}"><meta property="og:description" content="${e(data.description)}"><meta property="og:url" content="${e(data.canonicalUrl)}"><meta property="product:price:amount" content="${e(data.priceAmount)}"><meta property="product:price:currency" content="${e(data.priceCurrency)}"><meta name="twitter:card" content="${card}"><meta name="twitter:title" content="${e(data.title)}"><meta name="twitter:description" content="${e(data.description)}">${image}<meta http-equiv="refresh" content="0;url=${e(data.redirectUrl)}"></head><body><a href="${e(data.redirectUrl)}">${e(data.title)}</a><script>location.replace(${JSON.stringify(data.redirectUrl).replace(/</g, '\\u003c')})</script></body></html>`;
  }
}
