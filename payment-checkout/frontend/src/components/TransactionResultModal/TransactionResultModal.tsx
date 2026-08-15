import type { FC } from 'react';
import type { TransactionResponse } from '../../features/checkout/checkoutService';
import './TransactionResultModal.css';

interface TransactionResultModalProps {
  onClose: () => void;
  transaction: TransactionResponse;
}

export const TransactionResultModal: FC<TransactionResultModalProps> = ({
  onClose,
  transaction,
}) => {
  const isApproved = transaction.statusId === 2;

  return (
    <div
      className="TransactionResultModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-result-title"
    >
      <div className="TransactionResultModal__content">
        <span
          className={isApproved ? 'TransactionResultModal__status' : 'TransactionResultModal__status TransactionResultModal__status--declined'}
        >
          {isApproved ? '✓ Aprobado' : '× Rechazado'}
        </span>

        <h2
          className={isApproved ? 'TransactionResultModal__title' : 'TransactionResultModal__title TransactionResultModal__title--declined'}
          id="transaction-result-title"
        >
          {isApproved ? 'Pago aprobado' : 'Pago rechazado'}
        </h2>

        <p className="TransactionResultModal__message">
          {isApproved
            ? 'Tu transacción fue procesada correctamente.'
            : 'No fue posible aprobar el pago. Verifica tus datos e inténtalo nuevamente.'}
        </p>

        <p className="TransactionResultModal__reference">
          Número de transacción: <strong>#{transaction.id}</strong>
        </p>

        <button
          className="TransactionResultModal__button"
          onClick={onClose}
          type="button"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
