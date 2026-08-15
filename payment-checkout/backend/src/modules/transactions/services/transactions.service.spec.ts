import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mocked } from 'jest-mock';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from '../repositories/transactions.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { PaymentGateway } from '../../../infrastructure/integrations/payment/payment.gateway';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepository: Mocked<TransactionsRepository>;
  let productsRepository: Mocked<ProductsRepository>;
  let paymentGateway: Mocked<PaymentGateway>;

  beforeEach(async () => {
    const mockTransactionsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
      findByStatus: jest.fn(),
      updateStatus: jest.fn(),
    };

    const mockProductsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateStock: jest.fn(),
    };

    const mockPaymentGateway = {
      processPayment: jest.fn(),
      refundPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: mockTransactionsRepository,
        },
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
        {
          provide: PaymentGateway,
          useValue: mockPaymentGateway,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(
      TransactionsRepository,
    ) as Mocked<TransactionsRepository>;
    productsRepository = module.get(
      ProductsRepository,
    ) as Mocked<ProductsRepository>;
    paymentGateway = module.get(PaymentGateway) as Mocked<PaymentGateway>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    const productId = 1;
    const customerId = 1;
    const deliveryId = 1;
    const paymentRequest = {
      cardNumber: '1234567890123456',
      cvv: '123',
      expiryDate: '12/25',
    };

    const mockProduct = {
      id: productId,
      name: 'Product 1',
      price: 100000,
      description: 'Description 1',
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a transaction with approved payment', async () => {
      const mockTransaction = {
        id: 1,
        productAmount: 100000,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 115000,
        statusId: 2,
        productId,
        customerId,
        deliveryId,
        paymentId: 'payment123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsRepository.findById.mockResolvedValue(mockProduct);
      transactionsRepository.create.mockResolvedValue(mockTransaction);
      transactionsRepository.updateStatus.mockResolvedValue(mockTransaction);
      paymentGateway.processPayment.mockResolvedValue({
        success: true,
        paymentId: 'payment123',
      });

      const result = await service.createTransaction(
        productId,
        customerId,
        deliveryId,
        paymentRequest,
      );

      expect(result.statusId).toEqual(2); // APPROVED
      expect(productsRepository.findById).toHaveBeenCalledWith(productId);
      expect(productsRepository.updateStock).toHaveBeenCalledWith(productId, 1);
      expect(paymentGateway.processPayment).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productsRepository.findById.mockResolvedValue(null);

      await expect(
        service.createTransaction(productId, customerId, deliveryId, paymentRequest),
      ).rejects.toThrow(NotFoundException);
    });

    it('should decline transaction when payment fails', async () => {
      const mockTransaction = {
        id: 1,
        productAmount: 100000,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 115000,
        statusId: 3,
        productId,
        customerId,
        deliveryId,
        paymentId: 'payment123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productsRepository.findById.mockResolvedValue(mockProduct);
      transactionsRepository.create.mockResolvedValue(mockTransaction);
      transactionsRepository.updateStatus.mockResolvedValue(mockTransaction);
      paymentGateway.processPayment.mockResolvedValue({
        success: false,
        paymentId: 'payment123',
      });

      const result = await service.createTransaction(
        productId,
        customerId,
        deliveryId,
        paymentRequest,
      );

      expect(result.statusId).toEqual(3); // DECLINED
      expect(productsRepository.updateStock).not.toHaveBeenCalled();
    });

    it('should throw error when product is out of stock', async () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      productsRepository.findById.mockResolvedValue(outOfStockProduct);

      await expect(
        service.createTransaction(productId, customerId, deliveryId, paymentRequest),
      ).rejects.toThrow('Product is out of stock');
    });
  });
});
