import { SeedProduct } from './seed.types';

export const SEED_API = process.env.SEED_API_URL ?? 'http://localhost:3000/api';

export const SEED_EMAIL = process.env.ADMIN_EMAIL ?? '';

export const SEED_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

export const SEED_ORIGIN = process.env.SEED_ORIGIN;

export const SEED_CATEGORIES = ['Camisetas', 'Colecionáveis', 'Acessórios'];

export const SEED_SETTINGS = {
  instagramHandle: '300c.dub',
  whatsappNumber: '5511999999999',
  messageTemplate: 'Oi! Tenho interesse na peça {product} no tamanho {size}.',
};

const SIZES = ['P', 'M', 'G', 'GG'];

export const SEED_PRODUCTS: SeedProduct[] = [
  { name: 'Camiseta Chrome Preta', description: 'Algodão pesado, estampa frontal em prata. Exemplo de produto.', category: 'Camisetas', price: 119.9, promoPrice: null, variants: SIZES.map((label, index) => ({ label, stock: [2, 6, 5, 1][index] })), featured: true, visible: true, tint: '#14161a', caption: 'CHROME' },
  { name: 'Camiseta 300C Vermelha', description: 'Corte reto e estampa nas costas. Exemplo de produto.', category: 'Camisetas', price: 129.9, promoPrice: 99.9, variants: SIZES.map((label, index) => ({ label, stock: [1, 2, 0, 0][index] })), featured: true, visible: true, tint: '#7a0c12', caption: '300C' },
  { name: 'Camiseta Rolê Branca', description: 'Algodão leve para o dia a dia. Exemplo de produto.', category: 'Camisetas', price: 109.9, promoPrice: null, variants: SIZES.map((label) => ({ label, stock: 0 })), featured: false, visible: true, tint: '#cfd3d8', caption: 'ROLÊ' },
  { name: 'Miniatura Sedan 1:18', description: 'Miniatura de coleção em escala 1:18. Exemplo de produto.', category: 'Colecionáveis', price: 349.9, promoPrice: null, variants: [{ label: 'Único', stock: 3 }], featured: true, visible: true, tint: '#2b2f36', caption: '1:18' },
  { name: 'Chaveiro Metal', description: 'Chaveiro em metal escovado. Exemplo de produto.', category: 'Acessórios', price: 39.9, promoPrice: null, variants: [{ label: 'Único', stock: 20 }], featured: false, visible: true, tint: '#8d949c', caption: 'KEY' },
  { name: 'Boné Rascunho', description: 'Ainda em preparação, não aparece na vitrine.', category: 'Acessórios', price: 89.9, promoPrice: null, variants: [{ label: 'Único', stock: 5 }], featured: false, visible: false, tint: '#3a3f47', caption: 'BONÉ' },
];
