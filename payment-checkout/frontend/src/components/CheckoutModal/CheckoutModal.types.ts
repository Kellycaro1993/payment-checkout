import type { ChangeEvent, FormEvent } from 'react';

export interface CheckoutItem {
  productId: number;
  customerId: number;
  deliveryId: number;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
  installments: number;
}

export interface CheckoutFormData {
  customerId: number;
  deliveryId: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
  installments: number;
}

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutItem) => Promise<void>;
  totalAmount: number;
  productId: number;
}

export interface CheckoutModalViewProps {
  isOpen: boolean;
  formData: CheckoutFormData;
  loading: boolean;
  totalAmount: number;
  onClose: () => void;

  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}