import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { createHash } from 'crypto';
import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
} from './payment.gateway';

interface WompiTransaction {
  id: string;
  status: string;
}

interface WompiApiResponse<TData> {
  data?: TData;
}

interface WompiErrorResponse {
  error?: {
    reason?: string;
  };
}

interface WompiAcceptanceTokens {
  presigned_acceptance?: {
    acceptance_token?: string;
  };
  presigned_personal_data_auth?: {
    acceptance_token?: string;
  };
}

interface WompiPaymentPayload {
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  payment_method: {
    type: 'CARD';
    token: string;
    installments: number;
  };
  reference: string;
  signature: string;
  acceptance_token: string;
  accept_personal_auth: string;
}

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

    try {
      const response = await this.httpService.axiosRef.post<
        WompiApiResponse<WompiTransaction>,
        AxiosResponse<WompiApiResponse<WompiTransaction>>,
        WompiPaymentPayload
      >(
        `${process.env.WOMPI_API_URL}/transactions`,
        this.createPaymentPayload(request, amountInCents, signature),
        {
          headers: this.getPrivateHeaders(true),
        },
      );

      const transaction = response.data?.data;

      if (!transaction?.id) {
        return {
          success: false,
          errorMessage: 'Payment provider did not return a transaction id',
        };
      }

      const finalTransaction =
        transaction.status === 'PENDING'
          ? await this.waitForFinalStatus(transaction.id)
          : transaction;

      return {
        success: finalTransaction.status === 'APPROVED',
        paymentId: finalTransaction.id,
        errorMessage:
          finalTransaction.status !== 'APPROVED'
            ? `Payment status: ${finalTransaction.status}`
            : undefined,
      };
    } catch (error: unknown) {
      return {
        success: false,
        errorMessage: this.getErrorMessage(error),
      };
    }
  }

  private createPaymentPayload(
    request: PaymentRequest,
    amountInCents: number,
    signature: string,
  ): WompiPaymentPayload {
    return {
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
    };
  }

  private getPrivateHeaders(
    includeContentType = false,
  ): Record<string, string> {
    return {
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    };
  }

  private async waitForFinalStatus(
    transactionId: string,
  ): Promise<WompiTransaction> {
    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await this.delay(delayMs);

      const response = await this.httpService.axiosRef.get<
        WompiApiResponse<WompiTransaction>
      >(
        `${process.env.WOMPI_API_URL}/transactions/${transactionId}`,
        { headers: this.getPrivateHeaders() },
      );
      const transaction = response.data?.data;

      if (transaction && this.isFinalStatus(transaction.status)) {
        return transaction;
      }
    }

    return { id: transactionId, status: 'PENDING' };
  }

  private async getAcceptanceTokens(): Promise<{
    acceptanceToken: string;
    acceptPersonalAuth: string;
  }> {
    const publicKey = process.env.WOMPI_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error('WOMPI_PUBLIC_KEY is not configured');
    }

    const response = await this.httpService.axiosRef.get<
      WompiApiResponse<WompiAcceptanceTokens>
    >(`${process.env.WOMPI_API_URL}/merchants/${publicKey}`);
    const acceptanceToken =
      response.data?.data?.presigned_acceptance?.acceptance_token;
    const acceptPersonalAuth =
      response.data?.data?.presigned_personal_data_auth?.acceptance_token;

    if (!acceptanceToken || !acceptPersonalAuth) {
      throw new Error('Wompi acceptance tokens are unavailable');
    }

    return { acceptanceToken, acceptPersonalAuth };
  }

  private isFinalStatus(status: string): boolean {
    return ['APPROVED', 'DECLINED', 'ERROR', 'VOIDED'].includes(status);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      const response = error.response?.data as WompiErrorResponse | undefined;

      return response?.error?.reason ?? 'Payment provider error';
    }

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = error as { response?: { data?: WompiErrorResponse } };

      return response.response?.data?.error?.reason ?? 'Payment provider error';
    }

    return 'Payment provider error';
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
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
