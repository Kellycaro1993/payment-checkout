import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { TransactionsRepository } from '../repositories/transactions.repository';
import {PaymentGateway,PaymentRequest} from '../../../infrastructure/integrations/payment/payment.gateway';
import { CustomersRepository } from '../../customers/repositories/customers.repository';
import { DeliveriesRepository } from '../../deliveries/repositories/deliveries.repository';
import type { CreateTransactionItemDto } from '../dto/create-transaction.dto';

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
    private readonly customersRepository: CustomersRepository,
    private readonly deliveriesRepository: DeliveriesRepository,
  ) {}


  public async createTransaction(
    items: CreateTransactionItemDto[],
    customerId: number,
    deliveryId: number,
    payment: Omit<PaymentRequest, 'amount'>,
  ) {
    const productIds = items.map((item) => item.productId);

    if (new Set(productIds).size !== productIds.length) {
      throw new BadRequestException('A product can only appear once in the cart');
    }

    const products = await Promise.all(
      items.map(async (item) => ({
        item,
        product: await this.productsRepository.findById(item.productId),
      })),
    );

    for (const { item, product } of products) {
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Product ${item.productId} does not have enough stock`);
      }
    }

    const customer = await this.customersRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const delivery = await this.deliveriesRepository.findById(deliveryId);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.customerId !== customerId) {
      throw new BadRequestException(
        'Delivery does not belong to customer',
      );
    }

    const productAmount = products.reduce(
      (total, { item, product }) => total + product!.price * item.quantity,
      0,
    );
    const totalAmount = productAmount + BASE_FEE + DELIVERY_FEE;

    const transaction = await this.transactionsRepository.create({
      productAmount,
      baseFee: BASE_FEE,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      statusId: TRANSACTION_STATUS.PENDING,
      customerId,
      deliveryId,
      items: products.map(({ item, product }) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product!.price,
      })),
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

    await Promise.all(
      items.map((item) =>
        this.productsRepository.updateStock(item.productId, item.quantity),
      ),
    );

    const updatedTransaction =
      await this.transactionsRepository.updateStatus(
        transaction.id,
        TRANSACTION_STATUS.APPROVED,
        paymentResult.paymentId,
      );

    return updatedTransaction;
  }

  public async getTransactions() {
    return this.transactionsRepository.findAll();
  }

  public async getTransactionById(id: number) {
    const transaction =
      await this.transactionsRepository.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

}
