import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: Pick<Mocked<TransactionsService>, 'createTransaction'>;

  beforeEach(() => {
    const mockTransactionsService: Pick<
      Mocked<TransactionsService>,
      'createTransaction'
    > = {
      createTransaction: jest.fn<TransactionsService['createTransaction']>(),
    };

    controller = new TransactionsController(
      mockTransactionsService as unknown as TransactionsService,
    );

    service = mockTransactionsService;
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const dto = {
        items: [{ productId: 1, quantity: 1 }],
        customerId: 1,
        deliveryId: 1,
        customerEmail: 'test@example.com',
        cardToken: 'card-token-test',
        installments: 1,
        reference: 'TEST-TRANSACTION-001',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      };

      const transaction = {
        id: 1,
        statusId: 1,
      };

      service.createTransaction.mockResolvedValue(transaction as any);

      const result = await controller.create(dto);

      expect(result).toEqual(transaction);

      expect(service.createTransaction).toHaveBeenCalledTimes(1);
      expect(service.createTransaction).toHaveBeenCalledWith(
        dto.items,
        dto.customerId,
        dto.deliveryId,
        {
          customerEmail: dto.customerEmail,
          cardToken: dto.cardToken,
          installments: dto.installments,
          reference: dto.reference,
          acceptanceToken: dto.acceptanceToken,
          acceptPersonalAuth: dto.acceptPersonalAuth,
        },
      );
    });
  });
});
