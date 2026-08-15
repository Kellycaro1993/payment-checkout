import { render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { TransactionResultModal } from './TransactionResultModal';

const transaction = {
  id: 12,
  productAmount: 200000,
  baseFee: 5000,
  deliveryFee: 10000,
  totalAmount: 215000,
  paymentId: 'payment-1',
  statusId: 2,
  customerId: 1,
  deliveryId: 1,
};

describe('TransactionResultModal', () => {
  it('muestra una compra aprobada', () => {
    render(<TransactionResultModal onClose={jest.fn()} transaction={transaction} />);

    expect(screen.getByRole('heading', { name: 'Pago aprobado' })).toBeInTheDocument();
    expect(screen.getByText('Número de transacción:')).toBeInTheDocument();
  });

  it('muestra una compra rechazada', () => {
    render(<TransactionResultModal onClose={jest.fn()} transaction={{ ...transaction, statusId: 3 }} />);

    expect(screen.getByRole('heading', { name: 'Pago rechazado' })).toBeInTheDocument();
  });
});
