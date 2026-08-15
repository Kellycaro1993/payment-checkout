import { Injectable } from '@nestjs/common';
import { Delivery } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import { DeliveriesRepository } from './deliveries.repository';

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  public constructor(
    private readonly prisma: PrismaService,
  ) {}

  public async findById(id: number): Promise<Delivery | null> {
    return this.prisma.delivery.findUnique({
      where: { id },
    });
  }

  public async create(data: {
    address: string;
    city: string;
    customerId: number;
  }): Promise<Delivery> {
    return this.prisma.delivery.create({
      data,
    });
  }
}