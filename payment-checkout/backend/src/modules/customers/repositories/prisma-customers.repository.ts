import { Injectable } from '@nestjs/common';
import { Customer } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  public constructor(
    private readonly prisma: PrismaService,
  ) {}

  public async findById(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  public async create(data: {
    name: string;
    email: string;
    phone: string;
  }): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }
}