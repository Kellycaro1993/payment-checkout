import type { FC } from 'react';
import { CheckoutModal } from '../../components/CheckoutModal/CheckoutModal';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { TransactionResultModal } from '../../components/TransactionResultModal/TransactionResultModal';
import type { ProductPageViewProps } from './ProductPage.types';

export const ProductPageView: FC<ProductPageViewProps> = ({
  error,
  cartItems,
  isCheckoutOpen,
  loading,
  onCloseCheckout,
  onCloseTransactionResult,
  onAddToCart,
  onCheckoutCart,
  onRemoveFromCart,
  onSubmitCheckout,
  products,
  transactionResult
}) => {
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (loading) {
    return <main className="ProductPage__loading">Cargando productos...</main>;
  }

  if (error) {
    return <main className="ProductPage__error">{error}</main>;
  }

  return (
    <main className="ProductPage">
      <div className="ProductPage__container">
        <h1 className="ProductPage__title">Productos disponibles</h1>

        <aside className="ProductPage__cart" aria-label="Carrito de compras">
          <div className="ProductPage__cart-header">
            <h2>Carrito</h2>
            <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} artículos</span>
          </div>

          {cartItems.length === 0 ? (
            <p className="ProductPage__cart-empty">Aún no has agregado productos.</p>
          ) : (
            <>
              <ul className="ProductPage__cart-list">
                {cartItems.map(({ product, quantity }) => (
                  <li className="ProductPage__cart-item" key={product.id}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>Cantidad: {quantity}</span>
                    </div>
                    <div className="ProductPage__cart-actions">
                      <span>${(product.price * quantity).toLocaleString('es-CO')}</span>
                      <button onClick={() => onRemoveFromCart(product.id)} type="button">Quitar</button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="ProductPage__cart-total">Subtotal: ${cartTotal.toLocaleString('es-CO')}</p>
              <button className="ProductPage__cart-checkout" onClick={onCheckoutCart} type="button">
                Pagar carrito
              </button>
            </>
          )}
        </aside>

        <section className="ProductPage__grid" aria-label="Productos disponibles">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </section>
      </div>

      {cartItems.length > 0 && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={onCloseCheckout}
          onSubmit={onSubmitCheckout}
          items={cartItems.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          }))}
          totalAmount={cartTotal}
          transactionResult={transactionResult}
        />
      )}

      {transactionResult && (
        <TransactionResultModal
          onClose={onCloseTransactionResult}
          transaction={transactionResult}
        />
      )}
    </main>
  );
};
