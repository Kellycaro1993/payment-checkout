import type { FC } from 'react';
import type { ProductCardViewProps } from './ProductCard.types';

export const ProductCardView: FC<ProductCardViewProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <div className="ProductCard">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="ProductCard__image"
        />
      )}
      <h3 className="ProductCard__title">{product.name}</h3>
      <p className="ProductCard__description">{product.description}</p>
      <p className="ProductCard__price">
        ${product.price.toLocaleString('es-CO')}
      </p>
      <button
        className="ProductCard__button"
        disabled={product.stock <= 0}
        onClick={() => onAddToCart(product)}
        type="button"
      >
        {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
      </button>
    </div>
  );
};
