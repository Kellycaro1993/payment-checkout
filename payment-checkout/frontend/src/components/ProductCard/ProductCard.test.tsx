import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { ProductCard } from './ProductCard';

const product = {
  id: 1,
  name: 'Teclado mecánico',
  description: 'Teclado RGB',
  price: 249900,
  stock: 3,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('ProductCard', () => {
  it('agrega un producto disponible al carrito', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard onAddToCart={onAddToCart} product={product} />);

    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('deshabilita la compra cuando no hay stock', () => {
    render(<ProductCard onAddToCart={jest.fn()} product={{ ...product, stock: 0 }} />);

    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled();
  });
});
