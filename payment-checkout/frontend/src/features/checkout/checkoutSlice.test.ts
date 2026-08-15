import { describe, expect, it } from '@jest/globals';
import checkoutReducer, {
  resetCheckout,
  setCheckoutError,
  setCheckoutLoading,
  setCheckoutSuccess,
  setTransactionId,
} from './checkoutSlice';

describe('checkoutSlice', () => {
  it('actualiza y reinicia el estado del checkout', () => {
    let state = checkoutReducer(undefined, setCheckoutLoading(true));
    state = checkoutReducer(state, setCheckoutError('Pago rechazado'));
    state = checkoutReducer(state, setCheckoutSuccess(true));
    state = checkoutReducer(state, setTransactionId(10));

    expect(state).toMatchObject({
      loading: true,
      error: 'Pago rechazado',
      success: true,
      transactionId: 10,
    });

    expect(checkoutReducer(state, resetCheckout())).toMatchObject({
      loading: false,
      error: null,
      success: false,
      transactionId: null,
    });
  });
});
