import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { ProductPageView } from './ProductPageView';

const product = {
  id: 1,
  name: 'Audífonos',
  description: 'Inalámbricos',
  price: 189900,
  stock: 5,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const renderView = () => {
  const onCheckoutCart = jest.fn();
  const onRemoveFromCart = jest.fn();

  render(
    <ProductPageView
      cartItems={[{ product, quantity: 2 }]}
      error={null}
      isCheckoutOpen={false}
      loading={false}
      onAddToCart={jest.fn()}
      onCheckoutCart={onCheckoutCart}
      onCloseCheckout={jest.fn()}
      onCloseTransactionResult={jest.fn()}
      onRemoveFromCart={onRemoveFromCart}
      onSubmitCheckout={jest.fn(async () => undefined)}
      products={[product]}
      transactionResult={null}
    />,
  );

  return { onCheckoutCart, onRemoveFromCart };
};

describe('ProductPageView', () => {
  it('muestra el total y permite pagar el carrito completo', () => {
    const { onCheckoutCart } = renderView();

    expect(screen.getByText('Subtotal: $379.800')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pagar carrito' }));

    expect(onCheckoutCart).toHaveBeenCalledTimes(1);
  });

  it('permite quitar un artículo del carrito', () => {
    const { onRemoveFromCart } = renderView();

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(onRemoveFromCart).toHaveBeenCalledWith(product.id);
  });
});
