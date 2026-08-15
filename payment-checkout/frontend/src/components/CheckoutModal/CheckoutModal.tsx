import {
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from 'react';
import axios from 'axios';
import './CheckoutModal.css';
import { CheckoutModalView } from './CheckoutModalView';
import type {
  CheckoutFormData,
  CheckoutFieldErrors,
  CheckoutModalProps,
  CheckoutStep,
} from './CheckoutModal.types';

const BASE_FEE = 5000;
const DELIVERY_FEE = 10000;

const INITIAL_FORM_DATA: CheckoutFormData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',

  address: '',
  city: '',

  cardNumber: '',
  cardHolder: '',
  cardExpiration: '',
  cardCvv: '',
  installments: 1,
};

const isValidCardNumber = (cardNumber: string) => {
  const digits = cardNumber.replaceAll(' ', '');

  if (!/^\d{16}$/.test(digits)) {
    return false;
  }

  const total = [...digits]
    .reverse()
    .reduce((sum, digit, index) => {
      let value = Number(digit);

      if (index % 2 === 1) {
        value *= 2;
        if (value > 9) {
          value -= 9;
        }
      }

      return sum + value;
    }, 0);

  return total % 10 === 0;
};

const validateForm = (data: CheckoutFormData): CheckoutFieldErrors => {
  const errors: CheckoutFieldErrors = {};

  if (!data.customerName.trim()) errors.customerName = 'El nombre es obligatorio.';
  if (!/^\S+@\S+\.\S+$/.test(data.customerEmail)) errors.customerEmail = 'Ingresa un correo electrónico válido.';
  if (!data.customerPhone.trim()) errors.customerPhone = 'El teléfono es obligatorio.';
  if (!data.address.trim()) errors.address = 'La dirección es obligatoria.';
  if (!data.city.trim()) errors.city = 'La ciudad es obligatoria.';
  if (!isValidCardNumber(data.cardNumber)) errors.cardNumber = 'Ingresa un número de tarjeta válido.';
  if (data.cardHolder.trim().length < 3) errors.cardHolder = 'Ingresa el nombre del titular de la tarjeta.';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiration)) errors.cardExpiration = 'Usa el formato MM/AA.';
  if (!/^\d{3}$/.test(data.cardCvv)) errors.cardCvv = 'Ingresa los 3 dígitos del CVV.';
  if (!Number.isInteger(data.installments) || data.installments < 1) errors.installments = 'Selecciona una cantidad de cuotas válida.';

  return errors;
};

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalAmount,
  productId,
}) => {
  const [formData, setFormData] =
    useState<CheckoutFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [step, setStep] = useState<CheckoutStep>('form');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,) => {
    const { name, value } = event.target;
    const cardNumber = value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

    if (name === 'cardNumber') {
      setPaymentError(null);
    }

    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setFormData((previous) => ({
      ...previous,
      [name]: name === 'installments'
        ? Number(value)
        : name === 'cardNumber'
          ? cardNumber
          : value,
    }));
  };

  // const handleSubmit = async (
  //    event: FormEvent<HTMLFormElement>,
  // ) => {
  //   event.preventDefault();

  //   setLoading(true);

  //   try {
  //     await onSubmit({
  //       productId,
  //       amount: totalAmount,
  //       ...formData,
  //     });

  //     setFormData(INITIAL_FORM_DATA);
  //     onClose();
  //   } catch (error) {
  //     console.error('Checkout error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleClose = () => {
    setStep('form');
    setFormData(INITIAL_FORM_DATA);
    setFieldErrors({});
    setPaymentError(null);
    onClose();
  };

  const handleBack = () => {
    setStep('form');
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (step === 'form') {
      setStep('summary');
      return;
    }
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await onSubmit({
        productId,
        amount: totalAmount + BASE_FEE + DELIVERY_FEE,
        ...formData,
        cardNumber: formData.cardNumber.replaceAll(' ', ''),
      });
      handleClose();
    } catch (error) {
      console.error('Checkout error:', error);
      const cardError = axios.isAxiosError(error)
        ? error.response?.data?.error?.messages?.number?.[0]
        : undefined;

      setPaymentError(
        cardError
          ? 'El número de tarjeta no es válido. Revísalo e ingresa los 16 dígitos de una tarjeta válida.'
          : 'No fue posible procesar el pago. Revisa los datos e inténtalo nuevamente.',
      );
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutModalView
      isOpen={isOpen}
      formData={formData}
      fieldErrors={fieldErrors}
      loading={loading}
      paymentError={paymentError}
      step={step}
      productAmount={totalAmount}
      baseFee={BASE_FEE}
      deliveryFee={DELIVERY_FEE}
      totalAmount={totalAmount + BASE_FEE + DELIVERY_FEE}
      onClose={handleClose}
      onBack={handleBack}
      onChange={handleChange}
      onConfirm={handleConfirm}
      onSubmit={handleSubmit}
    />
  );
};
