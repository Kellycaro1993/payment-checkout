import { describe, expect, it } from '@jest/globals';
import productsReducer, { fetchProducts } from './productsSlice';

const product = {
  id: 1,
  name: 'Audífonos',
  description: 'Bluetooth',
  price: 189900,
  stock: 2,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('productsSlice', () => {
  it('actualiza el catálogo cuando la carga termina', () => {
    const pending = productsReducer(undefined, fetchProducts.pending('request-1', undefined));
    const fulfilled = productsReducer(
      pending,
      fetchProducts.fulfilled([product], 'request-1', undefined),
    );

    expect(pending.loading).toBe(true);
    expect(fulfilled).toMatchObject({ loading: false, error: null, products: [product] });
  });

  it('guarda el error cuando la carga falla', () => {
    const state = productsReducer(undefined, fetchProducts.rejected(null, 'request-1', undefined));

    expect(state.error).toBe('Unable to load products');
  });
});
