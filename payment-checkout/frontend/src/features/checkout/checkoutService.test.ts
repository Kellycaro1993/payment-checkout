import axios from 'axios';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { checkoutService } from './checkoutService';

describe('checkoutService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('crea un cliente', async () => {
    const customer = { id: 1, name: 'Ana', email: 'ana@example.com', phone: '3001234567' };
    const post = jest.spyOn(axios, 'post').mockResolvedValue({ data: customer });

    await expect(checkoutService.createCustomer(customer)).resolves.toEqual(customer);
    expect(post).toHaveBeenCalledWith('http://localhost:3000/customers', customer);
  });

  it('crea una transacción con todos los artículos del carrito', async () => {
    const data = {
      items: [{ productId: 1, quantity: 2 }],
      customerId: 1,
      deliveryId: 1,
      customerEmail: 'ana@example.com',
      cardToken: 'token',
      installments: 1,
      reference: 'payment-1',
      acceptanceToken: 'acceptance',
      acceptPersonalAuth: 'personal-auth',
    };
    const response = {
      id: 1,
      productAmount: 200000,
      baseFee: 5000,
      deliveryFee: 10000,
      totalAmount: 215000,
      paymentId: null,
      statusId: 2,
      customerId: 1,
      deliveryId: 1,
    };
    const post = jest.spyOn(axios, 'post').mockResolvedValue({ data: response });

    await expect(checkoutService.createTransaction(data)).resolves.toEqual(response);
    expect(post).toHaveBeenCalledWith('http://localhost:3000/transactions', data);
  });
});
