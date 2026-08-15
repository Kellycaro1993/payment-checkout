

import type { FC } from 'react';
import type { CheckoutModalViewProps } from './CheckoutModal.types';

const FieldError: FC<{ error?: string; id: string }> = ({ error, id }) => {
  if (!error) {
    return null;
  }

  return (
    <p className="CheckoutModal__field-error" id={id} role="alert">
      {error}
    </p>
  );
};

export const CheckoutModalView: FC<CheckoutModalViewProps> = ({
  isOpen,
  formData,
  fieldErrors,
  loading,
  paymentError,
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
  transactionResult
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
            noValidate
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
                autoComplete="name"
                name="customerName"
                onChange={onChange}
                placeholder="Nombre completo"
                required
                title="El nombre es obligatorio."
                type="text"
                value={formData.customerName}
                aria-describedby={fieldErrors.customerName ? 'customerName-error' : undefined}
                aria-invalid={Boolean(fieldErrors.customerName)}
              />
              <FieldError error={fieldErrors.customerName} id="customerName-error" />
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
                autoComplete="email"
                name="customerEmail"
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                required
                title="Ingresa un correo electrónico válido."
                type="email"
                value={formData.customerEmail}
                aria-describedby={fieldErrors.customerEmail ? 'customerEmail-error' : undefined}
                aria-invalid={Boolean(fieldErrors.customerEmail)}
              />
              <FieldError error={fieldErrors.customerEmail} id="customerEmail-error" />
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
                autoComplete="tel"
                inputMode="numeric"
                name="customerPhone"
                onChange={onChange}
                placeholder="3001234567"
                required
                title="El teléfono es obligatorio."
                type="tel"
                value={formData.customerPhone}
                aria-describedby={fieldErrors.customerPhone ? 'customerPhone-error' : undefined}
                aria-invalid={Boolean(fieldErrors.customerPhone)}
              />
              <FieldError error={fieldErrors.customerPhone} id="customerPhone-error" />
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
                autoComplete="street-address"
                name="address"
                onChange={onChange}
                placeholder="Calle 123 #45-67"
                required
                title="La dirección es obligatoria."
                type="text"
                value={formData.address}
                aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                aria-invalid={Boolean(fieldErrors.address)}
              />
              <FieldError error={fieldErrors.address} id="address-error" />
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
                autoComplete="address-level2"
                name="city"
                onChange={onChange}
                placeholder="Bogotá"
                required
                title="La ciudad es obligatoria."
                type="text"
                value={formData.city}
                aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                aria-invalid={Boolean(fieldErrors.city)}
              />
              <FieldError error={fieldErrors.city} id="city-error" />
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
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
                name="cardNumber"
                onChange={onChange}
                pattern="[0-9]{4}( [0-9]{4}){3}"
                placeholder="4111 1111 1111 1111"
                required
                title="Ingresa los 16 dígitos de la tarjeta."
                type="text"
                value={formData.cardNumber}
                aria-describedby={paymentError || fieldErrors.cardNumber ? 'cardNumber-error' : undefined}
                aria-invalid={Boolean(paymentError || fieldErrors.cardNumber)}
              />

              <FieldError error={paymentError || fieldErrors.cardNumber} id="cardNumber-error" />
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
                autoComplete="cc-name"
                minLength={3}
                name="cardHolder"
                onChange={onChange}
                placeholder="Nombre completo"
                required
                title="Ingresa el nombre del titular como aparece en la tarjeta."
                type="text"
                value={formData.cardHolder}
                aria-describedby={fieldErrors.cardHolder ? 'cardHolder-error' : undefined}
                aria-invalid={Boolean(fieldErrors.cardHolder)}
              />
              <FieldError error={fieldErrors.cardHolder} id="cardHolder-error" />
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
                autoComplete="cc-exp"
                maxLength={5}
                name="cardExpiration"
                onChange={onChange}
                pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                placeholder="MM/YY"
                required
                  title="Usa el formato MM/AA, por ejemplo 08/28."
                  type="text"
                  value={formData.cardExpiration}
                  aria-describedby={fieldErrors.cardExpiration ? 'cardExpiration-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.cardExpiration)}
                />
                <FieldError error={fieldErrors.cardExpiration} id="cardExpiration-error" />
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
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={3}
                name="cardCvv"
                onChange={onChange}
                pattern="[0-9]{3}"
                placeholder="123"
                required
                  title="Ingresa los 3 dígitos del CVV."
                  type="text"
                  value={formData.cardCvv}
                  aria-describedby={fieldErrors.cardCvv ? 'cardCvv-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.cardCvv)}
                />
                <FieldError error={fieldErrors.cardCvv} id="cardCvv-error" />
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
              required
                value={formData.installments}
                aria-describedby={fieldErrors.installments ? 'installments-error' : undefined}
                aria-invalid={Boolean(fieldErrors.installments)}
              >
                <option value={1}>1 cuota</option>
                <option value={2}>2 cuotas</option>
                <option value={3}>3 cuotas</option>
                <option value={6}>6 cuotas</option>
              <option value={12}>12 cuotas</option>
            </select>
            <FieldError error={fieldErrors.installments} id="installments-error" />
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
                <span>Producto:</span>
                <span>
                  ${productAmount.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Tarifa base:</span>
                <span>
                  ${baseFee.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Envío:</span>
                <span>
                  ${deliveryFee.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="CheckoutModal__summary-row CheckoutModal__summary-row--total">
                <span>Total:</span>
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
                <span>Nombre:</span>
                <span>{formData.customerName}</span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Dirección:</span>
                <span>{formData.address}</span>
              </div>

              <div className="CheckoutModal__summary-row">
                <span>Ciudad:</span>
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

        {step === 'result' && transactionResult && (
          <div className="CheckoutModal__body">
            <div className="CheckoutModal__result">
              <h3 className="CheckoutModal__subtitle">
                {transactionResult.statusId === 2
                  ? 'Pago aprobado'
                  : 'Pago rechazado'}
              </h3>

              <p>
                Transacción #{transactionResult.id}
              </p>

              <p>
                Total: $
                {transactionResult.totalAmount.toLocaleString('es-CO')}
              </p>

              <p>
                Estado:{' '}
                {transactionResult.statusId === 2
                  ? 'APPROVED'
                  : 'DECLINED'}
              </p>
            </div>

            <div className="CheckoutModal__footer">
              <button
                className="CheckoutModal__button CheckoutModal__button--submit"
                onClick={onClose}
                type="button"
              >
                Volver a productos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
