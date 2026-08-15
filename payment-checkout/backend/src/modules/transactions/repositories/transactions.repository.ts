import { Transaction } from '../../../../generated/prisma/client';

export abstract class TransactionsRepository {
  public abstract create(data: {
    productAmount: number;
    baseFee: number;
    deliveryFee: number;
    totalAmount: number;
    statusId: number;
    productId: number;
    customerId: number;
    deliveryId: number;
  }): Promise<Transaction>;

  public abstract findById(id: number): Promise<Transaction | null>;

  public abstract updateStatus(
    id: number,
    statusId: number,
    paymentId?: string,
  ): Promise<Transaction>;
}