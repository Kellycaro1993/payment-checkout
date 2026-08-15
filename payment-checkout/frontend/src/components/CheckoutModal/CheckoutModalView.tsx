import type { FC } from 'react';
import type { CheckoutModalViewProps } from './CheckoutModal.types';

export const CheckoutModalView: FC<CheckoutModalViewProps> = ({
  isOpen,
  formData,
  loading,
  step,
  productAmount,
  baseFee,
  deliveryFee,
  totalAmount,
  onClose,
  onBack,
  onChange,
  onConfirm,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="CheckoutModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div className="CheckoutModal__content">
        <div className="CheckoutModal__header">
          <h2
            className="CheckoutModal__title"
            id="checkout-title"
          >
            {step === 'form' ? 'Pagar' : 'Resumen de compra'}
          </h2>

          <button
            aria-label="Cerrar"
            className="CheckoutModal__close"
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {step === 'form' && (
          <form
            className="CheckoutModal__body"
            onSubmit={onSubmit}
          >
            <div className="CheckoutModal__section">
              <label className="CheckoutModal__label">
                Total a pagar
              </label>

              <p className="CheckoutModal__amount">
                ${productAmount.toLocaleString('es-CO')}
              </p>
            </div>

            <h3 className="CheckoutModal__subtitle">
              Información del cliente
            </h3>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="customerName"
              >
                Nombre
              </label>

              <input
                className="CheckoutModal__input"
                id="customerName"
                name="customerName"
                onChange={onChange}
                placeholder="Nombre completo"
                required
                type="text"
                value={formData.customerName}
              />
            </div>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="customerEmail"
              >
                Correo electrónico
              </label>

              <input
                className="CheckoutModal__input"
                id="customerEmail"
                name="customerEmail"
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                required
                type="email"
                value={formData.customerEmail}
              />
            </div>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="customerPhone"
              >
                Teléfono
              </label>

              <input
                className="CheckoutModal__input"
                id="customerPhone"
                name="customerPhone"
                onChange={onChange}
                placeholder="3001234567"
                required
                type="tel"
                value={formData.customerPhone}
              />
            </div>

            <h3 className="CheckoutModal__subtitle">
              Información de entrega
            </h3>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="address"
              >
                Dirección
              </label>

              <input
                className="CheckoutModal__input"
                id="address"
                name="address"
                onChange={onChange}
                placeholder="Calle 123 #45-67"
                required
                type="text"
                value={formData.address}
              />
            </div>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="city"
              >
                Ciudad
              </label>

              <input
                className="CheckoutModal__input"
                id="city"
                name="city"
                onChange={onChange}
                placeholder="Bogotá"
                required
                type="text"
                value={formData.city}
              />
            </div>

            <h3 className="CheckoutModal__subtitle">
              Información de pago
            </h3>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="cardNumber"
              >
                Número de tarjeta
              </label>

              <input
                className="CheckoutModal__input"
                id="cardNumber"
                maxLength={16}
                name="cardNumber"
                onChange={onChange}
                placeholder="4111111111111111"
                required
                type="text"
                value={formData.cardNumber}
              />
            </div>

            <div className="CheckoutModal__section">
              <label
                className="CheckoutModal__label"
                htmlFor="cardHolder"
              >
                Titular de la tarjeta
              </label>

              <input
                className="CheckoutModal__input"
                id="cardHolder"
                name="cardHolder"
                onChange={onChange}
                placeholder="Nombre completo"
                required
                type="text"
                value={formData.cardHolder}
              />
            </div>

            <div className="CheckoutModal__fields">
              <div className="CheckoutModal__section">
                <label
                  className="CheckoutModal__label"
                  htmlFor="cardExpiration"
                >
                  Vencimiento
                </label>

                <input
                  className="CheckoutModal__input"
                  id="cardExpiration"
                  maxLength={5}
                  name="cardExpiration"
                  onChange={onChange}
                  placeholder="MM/YY"
                  required
                  type="text"
                  value={formData.cardExpiration}
                />
              </div>

              <div className="CheckoutModal__section">
                <label
                  className="CheckoutModal__label"
                  htmlFor="cardCvv"
                >
                  CVV
                </label>

                <input
                  className="CheckoutModal__input"
                  id="cardCvv"
                  maxLength={3}
                  name="cardCvv"
                  onChange={onChange}
                  placeholder="123"
                  required
                  type="text"
                  value={formData.cardCvv}
                />
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
              <button
                className="CheckoutModal__button CheckoutModal__button--cancel"
                disabled={loading}
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>

              <button
                className="CheckoutModal__button CheckoutModal__button--submit"
                disabled={loading}
                type="submit"
              >
                Continuar
              </button>
            </div>
          </form>
        )}

        {step === 'summary' && (
          <div className="CheckoutModal__body">
            <h3 className="CheckoutModal__subtitle">
              Resumen del pago
            </h3>

            <div className="CheckoutModal__summary">
              <div className="CheckoutModal__summary-row">
                <span>Producto</span>
                <span>
                  ${productAmount.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Tarifa base</span>
                <span>
                  ${baseFee.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Envío</span>
                <span>
                  ${deliveryFee.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row CheckoutModal__summary-row--total">
                <span>Total</span>
                <span>
                  ${totalAmount.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <h3 className="CheckoutModal__subtitle">
              Entrega
            </h3>

            <div className="CheckoutModal__summary">
              <div className="CheckoutModal__summary-row">
                <span>Cliente</span>
                <span>{formData.customerName}</span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Dirección</span>
                <span>{formData.address}</span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Ciudad</span>
                <span>{formData.city}</span>
              </div>
            </div>

            <div className="CheckoutModal__footer">
              <button
                className="CheckoutModal__button CheckoutModal__button--cancel"
                disabled={loading}
                onClick={onBack}
                type="button"
              >
                Volver
              </button>

              <button
                className="CheckoutModal__button CheckoutModal__button--submit"
                disabled={loading}
                onClick={onConfirm}
                type="button"
              >
                {loading ? 'Procesando...' : 'Pagar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
