import { Injectable } from '@nestjs/common';
import { Transaction } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  public constructor(
    private readonly prisma: PrismaService,
  ) {}

  public async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async create(data: {
    productAmount: number;
    baseFee: number;
    deliveryFee: number;
    totalAmount: number;
    statusId: number;
    items: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
    }>;
    customerId: number;
    deliveryId: number;
  }): Promise<Transaction> {
    const { items, ...transaction } = data;

    return this.prisma.transaction.create({
      data: {
        ...transaction,
        items: {
          create: items,
        },
      },
    });
  }

  public async findById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  public async updateStatus(
    id: number,
    statusId: number,
    paymentId?: string,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        statusId,
        paymentId,
      },
    });
  }
}
