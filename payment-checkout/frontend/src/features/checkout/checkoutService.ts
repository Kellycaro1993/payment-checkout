import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CreateDeliveryPayload {
  address: string;
  city: string;
  customerId: number;
}

export interface DeliveryResponse {
  id: number;
  address: string;
  city: string;
  customerId: number;
}
export interface CreateTransactionPayload {
  productId: number;
  customerId: number;
  deliveryId: number;
  customerEmail: string;
  cardToken: string;
  installments: number;
  reference: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export interface TransactionResponse {
  id: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  paymentId: string | null;
  statusId: number;
  productId: number;
  customerId: number;
  deliveryId: number;
}

export const checkoutService = {
  createCustomer: async (
    data: CreateCustomerPayload,
  ): Promise<CustomerResponse> => {
    const response = await axios.post<CustomerResponse>(
      `${API_URL}/customers`,
      data,
    );

    return response.data;
  },

  createDelivery: async (
    data: CreateDeliveryPayload,
  ): Promise<DeliveryResponse> => {
    const response = await axios.post<DeliveryResponse>(
      `${API_URL}/deliveries`,
      data,
    );

    return response.data;
  },

  createTransaction: async (
    data: CreateTransactionPayload,
  ): Promise<TransactionResponse> => {
    const response = await axios.post<TransactionResponse>(
      `${API_URL}/transactions`,
      data,
    );

    return response.data;
  },
};
