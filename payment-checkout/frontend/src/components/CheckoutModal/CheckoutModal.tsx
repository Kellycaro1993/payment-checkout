import {
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from 'react';
import './CheckoutModal.css';
import { CheckoutModalView } from './CheckoutModalView';
import type {
  CheckoutFormData,
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
  const [step, setStep] = useState<CheckoutStep>('form');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === 'installments' ? Number(value) : value,
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
    onClose();
  };

  const handleBack = () => {
    setStep('form');
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

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
      });
      handleClose();
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutModalView
      isOpen={isOpen}
      formData={formData}
      loading={loading}
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
