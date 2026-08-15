import { useState, type FC } from 'react';
import './CheckoutModal.css';

interface CheckoutItem {
  productId: number;
  customerId: number;
  deliveryId: number;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutItem) => Promise<void>;
  totalAmount: number;
  productId: number;
}

export const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalAmount,
  productId,
}) => {
  const [formData, setFormData] = useState({
    customerId: 1,
    deliveryId: 1,
    cardNumber: '',
    cardHolder: '',
    cardExpiration: '',
    cardCvv: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        productId,
        amount: totalAmount,
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CheckoutModal">
      <div className="CheckoutModal__content">
        <div className="CheckoutModal__header">
          <h2 className="CheckoutModal__title">Pagar</h2>
          <button
            className="CheckoutModal__close"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="CheckoutModal__body">
          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label">Total a pagar</label>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#27ae60' }}>
              ${totalAmount.toLocaleString('es-CO')}
            </p>
          </div>

          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label" htmlFor="cardNumber">
              Número de tarjeta
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="4111111111111111"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={16}
              required
              className="CheckoutModal__input"
            />
          </div>

          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label" htmlFor="cardHolder">
              Titular de la tarjeta
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              placeholder="Nombre completo"
              value={formData.cardHolder}
              onChange={handleChange}
              required
              className="CheckoutModal__input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="CheckoutModal__section">
              <label className="CheckoutModal__label" htmlFor="cardExpiration">
                Vencimiento
              </label>
              <input
                type="text"
                id="cardExpiration"
                name="cardExpiration"
                placeholder="MM/YY"
                value={formData.cardExpiration}
                onChange={handleChange}
                maxLength={5}
                required
                className="CheckoutModal__input"
              />
            </div>

            <div className="CheckoutModal__section">
              <label className="CheckoutModal__label" htmlFor="cardCvv">
                CVV
              </label>
              <input
                type="text"
                id="cardCvv"
                name="cardCvv"
                placeholder="123"
                value={formData.cardCvv}
                onChange={handleChange}
                maxLength={3}
                required
                className="CheckoutModal__input"
              />
            </div>
          </div>

          <div className="CheckoutModal__footer">
            <button
              type="button"
              className="CheckoutModal__button CheckoutModal__button--cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="CheckoutModal__button CheckoutModal__button--submit"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
