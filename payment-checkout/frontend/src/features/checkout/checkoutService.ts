import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface CreateTransactionRequest {
  productId: number;
  customerId: number;
  deliveryId: number;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
}

export const checkoutService = {
  createTransaction: async (data: CreateTransactionRequest) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al procesar el pago'
        );
      }
      throw error;
    }
  },
};
