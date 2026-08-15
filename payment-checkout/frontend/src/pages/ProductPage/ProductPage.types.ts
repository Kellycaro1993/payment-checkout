import type { CheckoutItem } from '../../components/CheckoutModal/CheckoutModal.types';
import type { TransactionResponse } from '../../features/checkout/checkoutService';
import type { Product } from '../../features/products/productsSlice';

export interface ProductPageViewProps {
  error: string | null;
  isCheckoutOpen: boolean;
  loading: boolean;
  onCloseCheckout: () => void;
  onCloseTransactionResult: () => void;
  onSelectProduct: (product: Product) => void;
  onSubmitCheckout: (data: CheckoutItem) => Promise<void>;
  products: Product[];
  selectedProduct: Product | null;
  transactionResult: TransactionResponse | null;
}
