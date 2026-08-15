export interface PaymentRequest {
  amount: number;
  customerEmail: string;
  cardToken: string;
  installments: number;
  reference: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
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