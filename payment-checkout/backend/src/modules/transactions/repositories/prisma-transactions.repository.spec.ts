import { describe, expect, it, jest } from '@jest/globals';
import { PrismaTransactionsRepository } from './prisma-transactions.repository';

describe('PrismaTransactionsRepository', () => {
  const transaction = {
    id: 1,
    productAmount: 200000,
    baseFee: 5000,
    deliveryFee: 10000,
    totalAmount: 215000,
    paymentId: null,
    statusId: 1,
    customerId: 1,
    deliveryId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('crea, consulta y actualiza transacciones mediante Prisma', async () => {
    const prisma = {
      transaction: {
        create: jest.fn().mockResolvedValue(transaction),
        findMany: jest.fn().mockResolvedValue([transaction]),
        findUnique: jest.fn().mockResolvedValue(transaction),
        update: jest.fn().mockResolvedValue({ ...transaction, statusId: 2, paymentId: 'payment-1' }),
      },
    };
    const repository = new PrismaTransactionsRepository(prisma as any);
    const items = [{ productId: 1, quantity: 2, unitPrice: 100000 }];

    await expect(repository.create({ ...transaction, items })).resolves.toEqual(transaction);
    await expect(repository.findAll()).resolves.toEqual([transaction]);
    await expect(repository.findById(1)).resolves.toEqual(transaction);
    await expect(repository.updateStatus(1, 2, 'payment-1')).resolves.toMatchObject({ statusId: 2 });
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        ...transaction,
        items: { create: items },
      },
    });
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
  });
});
