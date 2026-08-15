import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al cargar los productos'
        );
      }
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al cargar el producto'
        );
      }
      throw error;
    }
  },
};