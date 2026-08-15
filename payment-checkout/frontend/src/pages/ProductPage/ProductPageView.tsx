import type { FC } from 'react';
import { CheckoutModal } from '../../components/CheckoutModal/CheckoutModal';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { ProductPageViewProps } from './ProductPage.types';

export const ProductPageView: FC<ProductPageViewProps> = ({
  error,
  isCheckoutOpen,
  loading,
  onCloseCheckout,
  onSelectProduct,
  onSubmitCheckout,
  products,
  selectedProduct,
  transactionResult,
}) => {
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

        <section className="ProductPage__grid" aria-label="Productos disponibles">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onSelectProduct}
            />
          ))}
        </section>
      </div>

      {selectedProduct && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={onCloseCheckout}
          onSubmit={onSubmitCheckout}
          productId={selectedProduct.id}
          totalAmount={selectedProduct.price}
          transactionResult={transactionResult}
        />
      )}
    </main>
  );
};
