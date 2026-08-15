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
import type { CartItem } from './ProductPage.types';

import './ProductPage.css';

const CART_STORAGE_KEY = 'shopping-cart';

const getStoredCartItems = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart as CartItem[] : [];
  } catch {
    return [];
  }
};

export const ProductPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [transactionResult, setTransactionResult] =
    useState<TransactionResponse | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(getStoredCartItems);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setTransactionResult(null);
    setCartItems((previous) => {
      const item = previous.find(({ product: cartProduct }) => cartProduct.id === product.id);

      if (!item) {
        return [...previous, { product, quantity: 1 }];
      }

      return previous.map((cartItem) =>
        cartItem.product.id === product.id
          ? {
              ...cartItem,
              quantity: Math.min(cartItem.quantity + 1, product.stock),
            }
          : cartItem,
      );
    });
  };

  const handleCheckoutCart = () => {
    setIsCheckoutOpen(true);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems((previous) =>
      previous.filter((item) => item.product.id !== productId),
    );
  };

  const handleCloseCheckout = async () => {
    setIsCheckoutOpen(false);

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
      items: data.items,
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
  setCartItems([]);

  console.log('Transaction:', transaction);
};

  return (
    <ProductPageView
      error={error}
      cartItems={cartItems}
      isCheckoutOpen={isCheckoutOpen}
      loading={loading}
      onCloseCheckout={handleCloseCheckout}
      onCloseTransactionResult={handleCloseTransactionResult}
      onAddToCart={handleAddToCart}
      onCheckoutCart={handleCheckoutCart}
      onRemoveFromCart={handleRemoveFromCart}
      onSubmitCheckout={handleCheckout}
      products={products}
      transactionResult={transactionResult}
    />
  );
};
