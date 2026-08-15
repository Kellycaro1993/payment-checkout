import type { FC } from 'react';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
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
      >
        {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
      </button>
    </div>
  );
};
