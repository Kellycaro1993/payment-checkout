import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createHash } from 'crypto';
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
    const amountInCents = request.amount * 100;

    const signature = this.generateIntegritySignature(
      request.reference,
      amountInCents,
    );

    const url = `${process.env.WOMPI_API_URL}/transactions`;

    try {
      const response = await this.httpService.axiosRef.post(
        url,
        {
          amount_in_cents: amountInCents,
          currency: 'COP',
          customer_email: request.customerEmail,
          payment_method: {
            type: 'CARD',
            token: request.cardToken,
            installments: request.installments,
          },
          reference: request.reference,
          signature,
          acceptance_token: request.acceptanceToken,
          accept_personal_auth: request.acceptPersonalAuth,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const transaction = response.data?.data;

      return {
        success: transaction?.status === 'APPROVED',
        paymentId: transaction?.id,
        errorMessage:
          transaction?.status !== 'APPROVED'
            ? `Payment status: ${transaction?.status ?? 'UNKNOWN'}`
            : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage:
          error?.response?.data?.error?.reason ??
          'Payment provider error',
      };
    }
  }

  private generateIntegritySignature(
    reference: string,
    amountInCents: number,
  ): string {
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!integritySecret) {
      throw new Error('WOMPI_INTEGRITY_SECRET is not configured');
    }

    const data = `${reference}${amountInCents}COP${integritySecret}`;

    return createHash('sha256')
      .update(data)
      .digest('hex');
  }
}