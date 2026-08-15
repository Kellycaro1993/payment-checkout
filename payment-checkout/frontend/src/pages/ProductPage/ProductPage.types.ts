import type { CheckoutItem } from '../../components/CheckoutModal/CheckoutModal.types';
import type { TransactionResponse } from '../../features/checkout/checkoutService';
import type { Product } from '../../features/products/productsSlice';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductPageViewProps {
  cartItems: CartItem[];
  error: string | null;
  isCheckoutOpen: boolean;
  loading: boolean;
  onCloseCheckout: () => void;
  onCloseTransactionResult: () => void;
  onAddToCart: (product: Product) => void;
  onCheckoutCart: () => void;
  onRemoveFromCart: (productId: number) => void;
  onSubmitCheckout: (data: CheckoutItem) => Promise<void>;
  products: Product[];
  transactionResult: TransactionResponse | null;
}
