
import './CheckoutModal.css';
import { CheckoutModalView } from './CheckoutModalView';
import type {CheckoutFormData,CheckoutModalProps} from './CheckoutModal.types';
import {useState,type ChangeEvent,type FC,type FormEvent} from 'react';

const INITIAL_FORM_DATA: CheckoutFormData = {
  customerId: 1,
  deliveryId: 1,
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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === 'installments' ||
        name === 'customerId' ||
        name === 'deliveryId'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
     event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        productId,
        amount: totalAmount,
        ...formData,
      });

      setFormData(INITIAL_FORM_DATA);
      onClose();
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
      totalAmount={totalAmount}
      onClose={onClose}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};