import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
} from './payment.gateway';

@Injectable()
export class WompiGateway implements PaymentGateway {
  public constructor(
    private readonly httpService: HttpService,
  ) {}

  public async processPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    return {
      success: true,
      paymentId: 'sandbox-payment',
    };
  }
}