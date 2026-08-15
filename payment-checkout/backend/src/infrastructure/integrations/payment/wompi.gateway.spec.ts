import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { HttpService } from '@nestjs/axios';
import { WompiGateway } from './wompi.gateway';

describe('WompiGateway', () => {
  let gateway: WompiGateway;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    httpService = {
      axiosRef: {
        post: jest.fn(),
      },
    } as unknown as jest.Mocked<HttpService>;

    gateway = new WompiGateway(httpService);

    process.env.WOMPI_API_URL = 'https://sandbox.test/v1';
    process.env.WOMPI_PRIVATE_KEY = 'private-key-test';
    process.env.WOMPI_INTEGRITY_SECRET = 'integrity-secret-test';
  });

  describe('processPayment', () => {
    it('should generate the integrity signature correctly', async () => {
  httpService.axiosRef.post.mockResolvedValue({
    data: {
      data: {
        id: 'transaction-signature-test',
        status: 'APPROVED',
      },
    },
  } as any);

  await gateway.processPayment({
    amount: 204900,
    customerEmail: 'test@example.com',
    cardToken: 'card-token-test',
    installments: 1,
    reference: 'TEST-SIGNATURE',
    acceptanceToken: 'acceptance-token-test',
    acceptPersonalAuth: 'personal-auth-test',
  });

  const expectedSignature =
    'aquí vamos a colocar el SHA-256 esperado';

  const call = httpService.axiosRef.post.mock.calls[0];

  const payload = call[1] as {
    signature: string;
  };

  expect(payload.signature).toBe(expectedSignature);
});
    it('should return success when payment is approved', async () => {
      httpService.axiosRef.post.mockResolvedValue({
        data: {
          data: {
            id: 'transaction-123',
            status: 'APPROVED',
          },
        },
      } as any);

      const result = await gateway.processPayment({
        amount: 204900,
        customerEmail: 'test@example.com',
        cardToken: 'card-token-test',
        installments: 1,
        reference: 'TEST-TRANSACTION-001',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      });

      expect(result).toEqual({
        success: true,
        paymentId: 'transaction-123',
        errorMessage: undefined,
      });

      expect(httpService.axiosRef.post).toHaveBeenCalledTimes(1);
    });

    it('should return failure when payment is declined', async () => {
      httpService.axiosRef.post.mockResolvedValue({
        data: {
          data: {
            id: 'transaction-456',
            status: 'DECLINED',
          },
        },
      } as any);

      const result = await gateway.processPayment({
        amount: 204900,
        customerEmail: 'test@example.com',
        cardToken: 'card-token-test',
        installments: 1,
        reference: 'TEST-TRANSACTION-002',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      });

      expect(result).toEqual({
        success: false,
        paymentId: 'transaction-456',
        errorMessage: 'Payment status: DECLINED',
      });
    });

    it('should send the correct payload to the payment provider', async () => {
      httpService.axiosRef.post.mockResolvedValue({
        data: {
          data: {
            id: 'transaction-789',
            status: 'APPROVED',
          },
        },
      } as any);

      await gateway.processPayment({
        amount: 204900,
        customerEmail: 'test@example.com',
        cardToken: 'card-token-test',
        installments: 1,
        reference: 'TEST-TRANSACTION-003',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      });

      const expectedAmountInCents = 20490000;

      expect(httpService.axiosRef.post).toHaveBeenCalledWith(
        'https://sandbox.test/v1/transactions',
        expect.objectContaining({
          amount_in_cents: expectedAmountInCents,
          currency: 'COP',
          customer_email: 'test@example.com',
          payment_method: {
            type: 'CARD',
            token: 'card-token-test',
            installments: 1,
          },
          reference: 'TEST-TRANSACTION-003',
          acceptance_token: 'acceptance-token-test',
          accept_personal_auth: 'personal-auth-test',
          signature: expect.any(String),
        }),
        {
          headers: {
            Authorization: 'Bearer private-key-test',
            'Content-Type': 'application/json',
          },
        },
      );
    });

    it('should handle payment provider errors', async () => {
      httpService.axiosRef.post.mockRejectedValue({
        response: {
          data: {
            error: {
              reason: 'Invalid payment data',
            },
          },
        },
      });

      const result = await gateway.processPayment({
        amount: 204900,
        customerEmail: 'test@example.com',
        cardToken: 'invalid-card-token',
        installments: 1,
        reference: 'TEST-TRANSACTION-004',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      });

      expect(result).toEqual({
        success: false,
        errorMessage: 'Invalid payment data',
      });
    });
  });
});