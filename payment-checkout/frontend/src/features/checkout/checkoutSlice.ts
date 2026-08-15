import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  loading: boolean;
  error: string | null;
  success: boolean;
  transactionId: number | null;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  success: false,
  transactionId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',

  initialState,

  reducers: {
    setCheckoutLoading: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },

    setCheckoutError: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.error = action.payload;
    },

    setCheckoutSuccess: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.success = action.payload;
    },

    setTransactionId: (
      state,
      action: PayloadAction<number | null>,
    ) => {
      state.transactionId = action.payload;
    },

    resetCheckout: () => initialState,
  },
});

export const {
  setCheckoutLoading,
  setCheckoutError,
  setCheckoutSuccess,
  setTransactionId,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;