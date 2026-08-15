import { describe, expect, it, jest } from '@jest/globals';
import { DeliveriesController } from './controllers/deliveries.controller';
import { PrismaDeliveriesRepository } from './repositories/prisma-deliveries.repository';
import { DeliveriesService } from './services/deliveries.service';

describe('Deliveries', () => {
  const delivery = { id: 1, address: 'Calle 10', city: 'Bogotá', customerId: 1, createdAt: new Date() };

  it('crea una entrega desde el controlador y servicio', async () => {
    const repository = { create: jest.fn().mockResolvedValue(delivery) };
    const controller = new DeliveriesController(new DeliveriesService(repository as any));

    await expect(controller.create(delivery)).resolves.toEqual(delivery);
    expect(repository.create).toHaveBeenCalledWith({ address: delivery.address, city: delivery.city, customerId: delivery.customerId });
  });

  it('consulta y crea entregas mediante Prisma', async () => {
    const prisma = {
      delivery: {
        findUnique: jest.fn().mockResolvedValue(delivery),
        create: jest.fn().mockResolvedValue(delivery),
      },
    };
    const repository = new PrismaDeliveriesRepository(prisma as any);

    await expect(repository.findById(1)).resolves.toEqual(delivery);
    await expect(repository.create(delivery)).resolves.toEqual(delivery);
    expect(prisma.delivery.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
