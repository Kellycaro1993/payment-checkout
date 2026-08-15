import axios from 'axios';
import type { Product } from './productsSlice';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(
      `${API_URL}/products`,
    );

    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get<Product>(
      `${API_URL}/products/${id}`,
    );

    return response.data;
  },
};