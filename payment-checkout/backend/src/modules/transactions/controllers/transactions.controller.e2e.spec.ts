import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeAll, afterAll, describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let controller: TransactionsController;

  const transactionsService: Pick<
    Mocked<TransactionsService>,
    'createTransaction'
  > = {
    createTransaction: jest.fn<TransactionsService['createTransaction']>(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: transactionsService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<TransactionsController>(
      TransactionsController,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a transaction', async () => {
    const transaction = {
      id: 1,
      productAmount: 189900,
      baseFee: 5000,
      deliveryFee: 10000,
      totalAmount: 204900,
      paymentId: null,
      statusId: 1,
      productId: 1,
      customerId: 1,
      deliveryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactionsService.createTransaction.mockResolvedValue(transaction);

    const dto = {
      productId: 1,
      customerId: 1,
      deliveryId: 1,
      customerEmail: 'test@example.com',
      cardToken: 'card-token-test',
      installments: 1,
      reference: 'TEST-TRANSACTION-001',
      acceptanceToken: 'acceptance-token-test',
      acceptPersonalAuth: 'personal-auth-test',
    };

    const result = await controller.create(dto);

    expect(result).toEqual(transaction);

    expect(transactionsService.createTransaction).toHaveBeenCalledWith(
      dto.productId,
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
