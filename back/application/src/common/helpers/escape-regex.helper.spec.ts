import { escapeRegex } from '@common/helpers/escape-regex.helper';

describe('escapeRegex', () => {
  it('neutralises regex metacharacters', () => {
    const pattern = new RegExp(escapeRegex('a.b(c)*'));
    expect(pattern.test('a.b(c)*')).toBe(true);
    expect(pattern.test('aXb(c)*')).toBe(false);
  });
});
