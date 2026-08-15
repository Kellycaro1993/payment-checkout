import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  checkoutData: {
    productId: number;
    customerId: number;
    deliveryId: number;
    amount: number;
    cardNumber: string;
    cardHolder: string;
    cardExpiration: string;
    cardCvv: string;
  } | null;
}

const initialState: CheckoutState = {
  isLoading: false,
  error: null,
  success: false,
  checkoutData: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCheckoutError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCheckoutSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setCheckoutData: (state, action: PayloadAction<CheckoutState['checkoutData']>) => {
      state.checkoutData = action.payload;
    },
    resetCheckout: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.checkoutData = null;
    },
  },
});

export const {
  setCheckoutLoading,
  setCheckoutError,
  setCheckoutSuccess,
  setCheckoutData,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
