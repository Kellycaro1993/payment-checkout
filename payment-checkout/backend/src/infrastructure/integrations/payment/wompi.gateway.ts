import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
} from './payment.gateway';

@Injectable()
export class WompiGateway implements PaymentGateway {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    void request;

    return {
      success: false,
      errorMessage: 'Wompi payment processing is not configured.',
    };
  }

  async refundPayment(transactionId: string): Promise<any> {
    // TODO: Implement Wompi refund
  }

  async getTransactionStatus(transactionId: string): Promise<any> {
    // TODO: Implement Wompi transaction status
  }
}
