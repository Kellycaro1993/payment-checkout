import axios from 'axios';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { productsService } from './productsService';

describe('productsService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('obtiene todos los productos', async () => {
    const products = [{ id: 1, name: 'Audífonos', description: 'Bluetooth', price: 189900, stock: 2 }];
    const get = jest.spyOn(axios, 'get').mockResolvedValue({ data: products });

    await expect(productsService.getProducts()).resolves.toEqual(products);
    expect(get).toHaveBeenCalledWith('http://localhost:3000/products');
  });

  it('obtiene un producto por su id', async () => {
    const product = { id: 2, name: 'Teclado', description: 'RGB', price: 249900, stock: 3 };
    const get = jest.spyOn(axios, 'get').mockResolvedValue({ data: product });

    await expect(productsService.getProductById(2)).resolves.toEqual(product);
    expect(get).toHaveBeenCalledWith('http://localhost:3000/products/2');
  });
});
