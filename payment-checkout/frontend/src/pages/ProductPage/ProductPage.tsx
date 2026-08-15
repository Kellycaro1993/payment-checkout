import { useState, type FC } from 'react';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { CheckoutModal } from '../../components/CheckoutModal/CheckoutModal';
import './ProductPage.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

export const ProductPage: FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // TODO: Connect with Redux for products
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Bluetooth wireless headphones with noise cancellation.',
      price: 189900,
      stock: 15,
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      description: 'Mechanical keyboard with RGB backlight.',
      price: 249900,
      stock: 10,
    },
    {
      id: 3,
      name: 'Smart Watch',
      description: 'Smart watch with health and fitness tracking.',
      price: 329900,
      stock: 8,
    },
  ]);

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    // Calculate total with fees
    const BASE_FEE = 5000;
    const DELIVERY_FEE = 10000;
    const total = product.price + BASE_FEE + DELIVERY_FEE;
    setTotalAmount(total);
    setShowCheckout(true);
  };

  const handleCheckout = async (data: any) => {
    // TODO: Implement checkout logic
    console.log('Checkout data:', data);
    setShowCheckout(false);
  };

  return (
    <div className="ProductPage">
      <div className="ProductPage__container">
        <h1 className="ProductPage__title">Productos Disponibles</h1>

        <div className="ProductPage__grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
          totalAmount={totalAmount}
          productId={selectedProduct.id}
        />
      )}
    </div>
  );
};
