import type { Product as ProductItem } from '../../features/products/productsSlice';

export type Product = ProductItem;

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export type ProductCardViewProps = ProductCardProps;
