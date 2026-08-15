import type { Product } from '../../features/products/productsSlice';

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export type ProductCardViewProps = ProductCardProps;