import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { fetchProducts } from '../features/products/productsSlice';

export function ProductPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products,
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <main className="catalog-status">Cargando productos...</main>;
  }

  if (error) {
    return <main className="catalog-status catalog-status--error">{error}</main>;
  }

  return (
    <main className="catalog">
      <header className="catalog__header">
        <div>
          <p className="catalog__eyebrow">Tienda</p>
          <h1>Productos disponibles</h1>
          <p className="catalog__intro">
            Selecciona un producto para continuar con el pago seguro.
          </p>
        </div>
        <span className="catalog__count">{products.length} productos</span>
      </header>

      {products.length === 0 ? (
        <section className="catalog__empty">
          No hay productos disponibles en este momento.
        </section>
      ) : (
        <section className="catalog__grid" aria-label="Productos disponibles">
        {products.map((product) => (
          <article className="product" key={product.id}>
            <div className="product__topline">
              <span className="product__id">Producto #{product.id}</span>
              <span className={product.stock > 0 ? 'product__stock' : 'product__stock product__stock--empty'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </span>
            </div>
            <h2>{product.name}</h2>
            <p className="product__description">{product.description}</p>
            <p className="product__price">
              ${product.price.toLocaleString('es-CO')}
            </p>
            <button type="button" disabled={product.stock === 0}>
              Pagar con tarjeta
            </button>
          </article>
        ))}
        </section>
      )}
    </main>
  );
}
