import { Injectable } from '@nestjs/common';
import { DeliveriesRepository } from '../repositories/deliveries.repository';

@Injectable()
export class DeliveriesService {
  public constructor(
    private readonly deliveriesRepository: DeliveriesRepository,
  ) {}

  public async create(
    address: string,
    city: string,
    customerId: number,
  ) {
    return this.deliveriesRepository.create({
      address,
      city,
      customerId,
    });
  }
}
