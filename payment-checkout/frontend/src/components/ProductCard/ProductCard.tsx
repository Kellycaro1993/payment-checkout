import type { FC } from 'react';
import './ProductCard.css';
import type { ProductCardProps } from './ProductCard.types';
import { ProductCardView } from './ProductCardView';

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <ProductCardView
      product={product}
      onAddToCart={onAddToCart}
    />
  );
};