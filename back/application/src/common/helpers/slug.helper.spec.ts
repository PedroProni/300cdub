import { toSlug, uniqueSlug } from '@common/helpers/slug.helper';

describe('slug helper', () => {
  it('removes accents and symbols', () => {
    expect(toSlug('Camiseta Preta Edição Limitada!')).toBe('camiseta-preta-edicao-limitada');
  });

  it('falls back when nothing usable remains', () => {
    expect(toSlug('!!!')).toBe('item');
  });

  it('appends a numeric suffix until the slug is free', async () => {
    const taken = new Set(['boneco', 'boneco-2']);
    expect(await uniqueSlug('Boneco', async (slug) => taken.has(slug))).toBe('boneco-3');
  });
});
