import { describe, expect, it, jest } from '@jest/globals';
import { CustomersController } from './controllers/customers.controller';
import { PrismaCustomersRepository } from './repositories/prisma-customers.repository';
import { CustomersService } from './services/customers.service';

describe('Customers', () => {
  const customer = { id: 1, name: 'Ana', email: 'ana@example.com', phone: '3001234567' };

  it('crea un cliente desde el controlador y servicio', async () => {
    const repository = {
      create: jest.fn().mockResolvedValue(customer),
      findByEmail: jest.fn().mockResolvedValue(null),
    };
    const service = new CustomersService(repository as any);
    const controller = new CustomersController(service);

    await expect(controller.create(customer)).resolves.toEqual(customer);
    expect(repository.create).toHaveBeenCalledWith({ name: customer.name, email: customer.email, phone: customer.phone });
  });

  it('reutiliza el cliente cuando ya existe el correo', async () => {
    const repository = {
      create: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(customer),
    };
    const service = new CustomersService(repository as any);

    await expect(service.create(customer.name, customer.email, customer.phone)).resolves.toEqual(customer);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('consulta y crea clientes mediante Prisma', async () => {
    const prisma = {
      customer: {
        findUnique: jest.fn().mockResolvedValue(customer),
        create: jest.fn().mockResolvedValue(customer),
      },
    };
    const repository = new PrismaCustomersRepository(prisma as any);

    await expect(repository.findById(1)).resolves.toEqual(customer);
    await expect(repository.findByEmail(customer.email)).resolves.toEqual(customer);
    await expect(repository.create(customer)).resolves.toEqual(customer);
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { email: customer.email } });
  });
});
