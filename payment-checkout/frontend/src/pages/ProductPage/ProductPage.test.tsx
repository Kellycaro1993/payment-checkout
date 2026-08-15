import axios from 'axios';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { store } from '../../app/store';
import { ProductPage } from './ProductPage';

const product = {
  id: 1,
  name: 'Audífonos',
  description: 'Bluetooth',
  price: 189900,
  stock: 5,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('ProductPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('carga productos y los agrega al carrito', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [product] });

    render(
      <Provider store={store}>
        <ProductPage />
      </Provider>,
    );

    expect(await screen.findByText('Audífonos')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));

    expect(screen.getByText('1 artículos')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $189.900')).toBeInTheDocument();
  });

  it('procesa el pago de todos los artículos del carrito', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async (url) => ({
      data: String(url).includes('/products')
        ? [product]
        : {
            data: {
              presigned_acceptance: { acceptance_token: 'acceptance' },
              presigned_personal_data_auth: { acceptance_token: 'personal-auth' },
            },
          },
    }));
    jest.spyOn(axios, 'post')
      .mockResolvedValueOnce({ data: { id: 1, name: 'Ana', email: 'ana@example.com', phone: '3001234567' } })
      .mockResolvedValueOnce({ data: { id: 1, address: 'Calle 10', city: 'Bogotá', customerId: 1 } })
      .mockResolvedValueOnce({ data: { data: { id: 'card-token' } } })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          productAmount: 189900,
          baseFee: 5000,
          deliveryFee: 10000,
          totalAmount: 204900,
          paymentId: 'payment-1',
          statusId: 2,
          customerId: 1,
          deliveryId: 1,
        },
      });

    render(
      <Provider store={store}>
        <ProductPage />
      </Provider>,
    );

    await screen.findByText('Audífonos');
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pagar carrito' }));

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '3001234567' } });
    fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle 10' } });
    fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Bogotá' } });
    fireEvent.change(screen.getByLabelText('Número de tarjeta'), { target: { value: '4242424242424242' } });
    fireEvent.change(screen.getByLabelText('Titular de la tarjeta'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Vencimiento'), { target: { value: '08/28' } });
    fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Pago aprobado' })).toBeInTheDocument();
    });
  });
});
