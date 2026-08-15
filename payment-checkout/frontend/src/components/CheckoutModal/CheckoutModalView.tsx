import type { FC } from 'react';
import type { CheckoutModalViewProps } from './CheckoutModal.types';

export const CheckoutModalView: FC<CheckoutModalViewProps> = ({
  isOpen,
  formData,
  loading,
  totalAmount,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="CheckoutModal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="CheckoutModal__content">
        <div className="CheckoutModal__header">
          <h2 className="CheckoutModal__title" id="checkout-title">Pagar</h2>
          <button
            aria-label="Cerrar"
            className="CheckoutModal__close"
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <form className="CheckoutModal__body" onSubmit={onSubmit}>
          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label">Total a pagar</label>
            <p className="CheckoutModal__amount">${totalAmount.toLocaleString('es-CO')}</p>
          </div>

          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label" htmlFor="cardNumber">Numero de tarjeta</label>
            <input className="CheckoutModal__input" id="cardNumber" maxLength={16} name="cardNumber" onChange={onChange} placeholder="4111111111111111" required type="text" value={formData.cardNumber} />
          </div>

          <div className="CheckoutModal__section">
            <label className="CheckoutModal__label" htmlFor="cardHolder">Titular de la tarjeta</label>
            <input className="CheckoutModal__input" id="cardHolder" name="cardHolder" onChange={onChange} placeholder="Nombre completo" required type="text" value={formData.cardHolder} />
          </div>

          <div className="CheckoutModal__fields">
            <div className="CheckoutModal__section">
              <label className="CheckoutModal__label" htmlFor="cardExpiration">Vencimiento</label>
              <input className="CheckoutModal__input" id="cardExpiration" maxLength={5} name="cardExpiration" onChange={onChange} placeholder="MM/YY" required type="text" value={formData.cardExpiration} />
            </div>
            <div className="CheckoutModal__section">
              <label className="CheckoutModal__label" htmlFor="cardCvv">CVV</label>
              <input className="CheckoutModal__input" id="cardCvv" maxLength={3} name="cardCvv" onChange={onChange} placeholder="123" required type="text" value={formData.cardCvv} />
            </div>
          </div>
          <div className="CheckoutModal__section">
            <label
              className="CheckoutModal__label"
              htmlFor="installments"
            >
              Cuotas
            </label>

            <select
              className="CheckoutModal__input"
              id="installments"
              name="installments"
              onChange={onChange}
              value={formData.installments}
            >
              <option value={1}>1 cuota</option>
              <option value={2}>2 cuotas</option>
              <option value={3}>3 cuotas</option>
              <option value={6}>6 cuotas</option>
              <option value={12}>12 cuotas</option>
            </select>
          </div>

          <div className="CheckoutModal__footer">
            <button className="CheckoutModal__button CheckoutModal__button--cancel" disabled={loading} onClick={onClose} type="button">Cancelar</button>
            <button className="CheckoutModal__button CheckoutModal__button--submit" disabled={loading} type="submit">{loading ? 'Procesando...' : 'Pagar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
