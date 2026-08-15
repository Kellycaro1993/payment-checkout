export interface PaymentRequest {
  amount: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiration: string;
  cardCvv: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  errorMessage?: string;
}

export abstract class PaymentGateway {
  public abstract processPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse>;
}