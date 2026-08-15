import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import type { CheckoutItem } from '../../components/CheckoutModal/CheckoutModal.types';
import type { Product } from '../../components/ProductCard/ProductCard.types';
import { fetchProducts } from '../../features/products/productsSlice';
import { ProductPageView } from './ProductPageView';
import './ProductPage.css';

export const ProductPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleCheckout = async (data: CheckoutItem) => {
    // TODO: Enviar la transacción al servicio de checkout.
    console.log('Checkout data:', data);
  };

  return (
    <ProductPageView
      error={error}
      isCheckoutOpen={isCheckoutOpen}
      loading={loading}
      onCloseCheckout={handleCloseCheckout}
      onSelectProduct={handleSelectProduct}
      onSubmitCheckout={handleCheckout}
      products={products}
      selectedProduct={selectedProduct}
    />
  );
};
