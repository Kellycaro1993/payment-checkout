import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { TransactionsRepository } from '../repositories/transactions.repository';
import {
  PaymentGateway,
  PaymentRequest,
} from '../../../infrastructure/integrations/payment/payment.gateway';

const TRANSACTION_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  DECLINED: 3,
  ERROR: 4,
} as const;

const BASE_FEE = 5000;
const DELIVERY_FEE = 10000;

@Injectable()
export class TransactionsService {
  public constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  public async createTransaction(
    productId: number,
    customerId: number,
    deliveryId: number,
    payment: Omit<PaymentRequest, 'amount'>,
  ) {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock <= 0) {
      throw new Error('Product is out of stock');
    }

    const productAmount = product.price;
    const totalAmount = productAmount + BASE_FEE + DELIVERY_FEE;

    const transaction = await this.transactionsRepository.create({
      productAmount,
      baseFee: BASE_FEE,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      statusId: TRANSACTION_STATUS.PENDING,
      productId,
      customerId,
      deliveryId,
    });

    const paymentResult = await this.paymentGateway.processPayment({
      ...payment,
      amount: totalAmount,
    });

    if (!paymentResult.success) {
      await this.transactionsRepository.updateStatus(
        transaction.id,
        TRANSACTION_STATUS.DECLINED,
        paymentResult.paymentId,
      );

      return {
        ...transaction,
        statusId: TRANSACTION_STATUS.DECLINED,
        paymentId: paymentResult.paymentId,
      };
    }

    await this.productsRepository.updateStock(productId, 1);

    const updatedTransaction =
      await this.transactionsRepository.updateStatus(
        transaction.id,
        TRANSACTION_STATUS.APPROVED,
        paymentResult.paymentId,
      );

    return updatedTransaction;
  }
}
