import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from '../repositories/transactions.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { PaymentGateway } from '../../../infrastructure/integrations/payment/payment.gateway';
import { CustomersRepository } from '../../customers/repositories/customers.repository';
import { DeliveriesRepository } from '../../deliveries/repositories/deliveries.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let customersRepository: jest.Mocked<CustomersRepository>;
  let deliveriesRepository: jest.Mocked<DeliveriesRepository>;

  let transactionsRepository: jest.Mocked<TransactionsRepository>;
  let productsRepository: jest.Mocked<ProductsRepository>;
  let paymentGateway: jest.Mocked<PaymentGateway>;

  beforeEach(() => {
    transactionsRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    deliveriesRepository = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    customersRepository = {
      findById: jest.fn(),
      create: jest.fn(),
    };

    productsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    paymentGateway = {
      processPayment: jest.fn(),
    };

    service = new TransactionsService(
      transactionsRepository,
      productsRepository,
      paymentGateway,
      customersRepository,
      deliveriesRepository
    );
  });

  describe('createTransaction', () => {

    it('should throw BadRequestException when delivery does not belong to customer', async () => {
        const product = {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Bluetooth wireless headphones',
            price: 189900,
            stock: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        productsRepository.findById.mockResolvedValue(product);

        customersRepository.findById.mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            phone: '3001234567',
        });

        deliveriesRepository.findById.mockResolvedValue({
            id: 1,
            address: 'Calle 123 #45-67',
            city: 'Bogotá',
            customerId: 2,
            createdAt: new Date(),
        });

        await expect(
            service.createTransaction(
            [{ productId: 1, quantity: 1 }],
            1,
            1,
            {
                customerEmail: 'test@example.com',
                cardToken: 'card-token-test',
                installments: 1,
                reference: 'TEST-TRANSACTION-001',
                acceptanceToken: 'acceptance-token-test',
                acceptPersonalAuth: 'personal-auth-test',
            },
            ),
        ).rejects.toThrow(BadRequestException);

        expect(transactionsRepository.create).not.toHaveBeenCalled();
        expect(paymentGateway.processPayment).not.toHaveBeenCalled();
    });
    it('should approve the transaction and update stock when payment succeeds', async () => {
      const product = {
        id: 1,
        name: 'Wireless Headphones',
        description: 'Bluetooth wireless headphones',
        price: 189900,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transaction = {
        id: 1,
        productAmount: 189900,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 204900,
        statusId: 1,
        paymentId: null,
        customerId: 1,
        deliveryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const approvedTransaction = {
        ...transaction,
        statusId: 2,
        paymentId: 'payment-123',
      };

      productsRepository.findById.mockResolvedValue(product);
      customersRepository.findById.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '3001234567',
        });

      deliveriesRepository.findById.mockResolvedValue({
        id: 1,
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        customerId: 1,
        createdAt: new Date(),
      });

      transactionsRepository.create.mockResolvedValue(transaction);

      paymentGateway.processPayment.mockResolvedValue({
        success: true,
        paymentId: 'payment-123',
      });

      transactionsRepository.updateStatus.mockResolvedValue(
        approvedTransaction,
      );

      productsRepository.updateStock.mockResolvedValue({
        ...product,
        stock: 14,
      });

      const result = await service.createTransaction(
        [{ productId: 1, quantity: 1 }],
        1,
        1,
        {
          customerEmail: 'test@example.com',
          cardToken: 'card-token-test',
          installments: 1,
          reference: 'TEST-TRANSACTION-001',
          acceptanceToken: 'acceptance-token-test',
          acceptPersonalAuth: 'personal-auth-test',
        },
      );

      expect(result).toEqual(approvedTransaction);

      expect(transactionsRepository.create).toHaveBeenCalledWith({
        productAmount: 189900,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 204900,
        statusId: 1,
        customerId: 1,
        deliveryId: 1,
        items: [{ productId: 1, quantity: 1, unitPrice: 189900 }],
      });

      expect(paymentGateway.processPayment).toHaveBeenCalledWith({
        amount: 204900,
        customerEmail: 'test@example.com',
        cardToken: 'card-token-test',
        installments: 1,
        reference: 'TEST-TRANSACTION-001',
        acceptanceToken: 'acceptance-token-test',
        acceptPersonalAuth: 'personal-auth-test',
      });

      expect(productsRepository.updateStock).toHaveBeenCalledWith(1, 1);

      expect(transactionsRepository.updateStatus).toHaveBeenCalledWith(
        1,
        2,
        'payment-123',
      );
    });

    it('should decline the transaction when payment fails', async () => {
      const product = {
        id: 1,
        name: 'Wireless Headphones',
        description: 'Bluetooth wireless headphones',
        price: 189900,
        stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const transaction = {
        id: 1,
        productAmount: 189900,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 204900,
        statusId: 1,
        paymentId: null,
        customerId: 1,
        deliveryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const declinedTransaction = {
        ...transaction,
        statusId: 3,
        paymentId: 'payment-456',
      };

      productsRepository.findById.mockResolvedValue(product);

      customersRepository.findById.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '3001234567',
        });
            
      deliveriesRepository.findById.mockResolvedValue({
        id: 1,
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
        customerId: 1,
        createdAt: new Date(),
      });

      transactionsRepository.create.mockResolvedValue(transaction);

      paymentGateway.processPayment.mockResolvedValue({
        success: false,
        paymentId: 'payment-456',
        errorMessage: 'Payment declined',
      });

      transactionsRepository.updateStatus.mockResolvedValue(
        declinedTransaction,
      );

      const result = await service.createTransaction(
        [{ productId: 1, quantity: 1 }],
        1,
        1,
        {
          customerEmail: 'test@example.com',
          cardToken: 'card-token-test',
          installments: 1,
          reference: 'TEST-TRANSACTION-001',
          acceptanceToken: 'acceptance-token-test',
          acceptPersonalAuth: 'personal-auth-test',
        },
      );

      expect(result.statusId).toBe(3);

      expect(transactionsRepository.updateStatus).toHaveBeenCalledWith(
        1,
        3,
        'payment-456',
      );

      expect(productsRepository.updateStock).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when the product does not exist', async () => {
      productsRepository.findById.mockResolvedValue(null);

      await expect(
        service.createTransaction(
        [{ productId: 999, quantity: 1 }],
          1,
          1,
          {
            customerEmail: 'test@example.com',
            cardToken: 'card-token-test',
            installments: 1,
            reference: 'TEST-TRANSACTION-001',
            acceptanceToken: 'acceptance-token-test',
            acceptPersonalAuth: 'personal-auth-test',
          },
        ),
      ).rejects.toThrow(NotFoundException);

      expect(transactionsRepository.create).not.toHaveBeenCalled();
      expect(paymentGateway.processPayment).not.toHaveBeenCalled();
    });
  });
});
