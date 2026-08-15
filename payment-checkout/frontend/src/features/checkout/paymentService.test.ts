import axios from 'axios';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { paymentService } from './paymentService';

describe('paymentService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('extrae el token de la tarjeta desde la respuesta de Wompi', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: { data: { id: 'card-token' } } });

    await expect(
      paymentService.tokenizeCard({
        number: '4242424242424242',
        cvc: '123',
        expMonth: '08',
        expYear: '28',
        cardHolder: 'Ana Pérez',
      }),
    ).resolves.toBe('card-token');
  });

  it('extrae los tokens de aceptación', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        data: {
          presigned_acceptance: { acceptance_token: 'acceptance' },
          presigned_personal_data_auth: { acceptance_token: 'personal-auth' },
        },
      },
    });

    await expect(paymentService.getAcceptanceTokens()).resolves.toEqual({
      acceptanceToken: 'acceptance',
      acceptPersonalAuth: 'personal-auth',
    });
  });
});
