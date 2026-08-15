import { describe, expect, it, jest } from '@jest/globals';
import { PrismaProductsRepository } from './prisma-products.repository';

describe('PrismaProductsRepository', () => {
  const product = { id: 1, name: 'Audífonos', description: 'Bluetooth', price: 189900, stock: 5, createdAt: new Date(), updatedAt: new Date() };

  it('consulta y descuenta productos mediante Prisma', async () => {
    const prisma = {
      product: {
        findMany: jest.fn().mockResolvedValue([product]),
        findUnique: jest.fn().mockResolvedValue(product),
        update: jest.fn().mockResolvedValue({ ...product, stock: 3 }),
      },
    };
    const repository = new PrismaProductsRepository(prisma as any);

    await expect(repository.findAll()).resolves.toEqual([product]);
    await expect(repository.findById(1)).resolves.toEqual(product);
    await expect(repository.updateStock(1, 2)).resolves.toMatchObject({ stock: 3 });
    expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { stock: { decrement: 2 } } });
  });
});
