import { useEffect, useState, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paymentService } from '../../features/checkout/paymentService';

import type { AppDispatch, RootState } from '../../app/store';
import type { CheckoutItem } from '../../components/CheckoutModal/CheckoutModal.types';
import type { Product } from '../../features/products/productsSlice';

import { checkoutService } from '../../features/checkout/checkoutService';
import { fetchProducts } from '../../features/products/productsSlice';

import { ProductPageView } from './ProductPageView';
import type { TransactionResponse } from '../../features/checkout/checkoutService';

import './ProductPage.css';

export const ProductPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);

const [transactionResult, setTransactionResult] =
  useState<TransactionResponse | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSelectProduct = (product: Product) => {
    setTransactionResult(null);
    setSelectedProduct(product);
  };

  const handleCloseCheckout = async () => {
    setSelectedProduct(null);

    await dispatch(fetchProducts());
  };

  const handleCloseTransactionResult = () => {
    setTransactionResult(null);
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

  const [expMonth, expYear] = data.cardExpiration.split('/');

  const cardToken = await paymentService.tokenizeCard({
    number: data.cardNumber,
    cvc: data.cardCvv,
    expMonth,
    expYear,
    cardHolder: data.cardHolder,
  });

  const acceptanceTokens =
    await paymentService.getAcceptanceTokens();

  const transaction =
    await checkoutService.createTransaction({
      productId: data.productId,
      customerId: customer.id,
      deliveryId: delivery.id,
      customerEmail: data.customerEmail,
      cardToken,
      installments: data.installments,
      reference: `payment-${Date.now()}`,
      acceptanceToken:
        acceptanceTokens.acceptanceToken,
      acceptPersonalAuth:
        acceptanceTokens.acceptPersonalAuth,
    });

  setTransactionResult(transaction);

  console.log('Transaction:', transaction);
};

  return (
    <ProductPageView
      error={error}
      isCheckoutOpen={selectedProduct !== null}
      loading={loading}
      onCloseCheckout={handleCloseCheckout}
      onCloseTransactionResult={handleCloseTransactionResult}
      onSelectProduct={handleSelectProduct}
      onSubmitCheckout={handleCheckout}
      products={products}
      selectedProduct={selectedProduct}
      transactionResult={transactionResult}
    />
  );
};
