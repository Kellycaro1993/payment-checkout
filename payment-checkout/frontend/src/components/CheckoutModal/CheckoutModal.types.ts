import type { ChangeEvent, FormEvent } from 'react';

export type CheckoutStep = 'form' | 'summary';
export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  address: string;
  city: string;

  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
  installments: number;
}

export interface CheckoutItem extends CheckoutFormData {
  productId: number;
  amount: number;
}

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutFormData, string>
>;

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
  fieldErrors: CheckoutFieldErrors;
  loading: boolean;
  paymentError: string | null;
  totalAmount: number;
  onClose: () => void;
  step: CheckoutStep;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  onBack: () => void;
  onConfirm: () => Promise<void>;

  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}
