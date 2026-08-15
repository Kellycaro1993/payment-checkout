import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { CheckoutModal } from './CheckoutModal';

describe('CheckoutModal', () => {
  it('valida el formulario y muestra el resumen antes de pagar', () => {
    const onSubmit = jest.fn(async () => undefined);

    render(
      <CheckoutModal
        isOpen
        items={[{ productId: 1, quantity: 2 }]}
        onClose={jest.fn()}
        onSubmit={onSubmit}
        totalAmount={200000}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '3001234567' } });
    fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle 10 # 20-30' } });
    fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Bogotá' } });
    fireEvent.change(screen.getByLabelText('Número de tarjeta'), { target: { value: '4242424242424242' } });
    fireEvent.change(screen.getByLabelText('Titular de la tarjeta'), { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getByLabelText('Vencimiento'), { target: { value: '08/28' } });
    fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByRole('heading', { name: 'Resumen de compra' })).toBeInTheDocument();
    expect(screen.getByText('Nombre:')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
