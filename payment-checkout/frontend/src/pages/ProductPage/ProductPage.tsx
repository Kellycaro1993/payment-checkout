import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '../../app/store';
import type { CheckoutItem } from '../../components/CheckoutModal/CheckoutModal.types';
import type { Product } from '../../features/products/productsSlice';

import { checkoutService } from '../../features/checkout/checkoutService';
import { fetchProducts } from '../../features/products/productsSlice';

import { ProductPageView } from './ProductPageView';

import './ProductPage.css';

export const ProductPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseCheckout = () => {
    setSelectedProduct(null);
  };

  const handleCheckout = async (data: CheckoutItem) => {
    const customer = await checkoutService.createCustomer({
      name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
    });

    const delivery = await checkoutService.createDelivery({
      address: data.address,
      city: data.city,
      customerId: customer.id,
    });

    console.log('Customer created:', customer);
    console.log('Delivery created:', delivery);

    /*
     * El siguiente paso será crear la transacción
     * usando:
     *
     * customer.id
     * delivery.id
     * data.productId
     *
     * y después integrar el token de la tarjeta.
     */
  };

  return (
    <ProductPageView
      error={error}
      isCheckoutOpen={selectedProduct !== null}
      loading={loading}
      onCloseCheckout={handleCloseCheckout}
      onSelectProduct={handleSelectProduct}
      onSubmitCheckout={handleCheckout}
      products={products}
      selectedProduct={selectedProduct}
    />
  );
};