import { Injectable } from '@nestjs/common';
import { IPaymentGateway } from './payment.gateway';

@Injectable()
export class WompiGateway implements IPaymentGateway {
  async processPayment(amount: number, currency: string, data: any): Promise<any> {
    // TODO: Implement Wompi payment processing
  }

  async refundPayment(transactionId: string): Promise<any> {
    // TODO: Implement Wompi refund
  }

  async getTransactionStatus(transactionId: string): Promise<any> {
    // TODO: Implement Wompi transaction status
  }
}
