import { Injectable } from '@nestjs/common';
import { CustomersRepository } from '../repositories/customers.repository';

@Injectable()
export class CustomersService {
  public constructor(
    private readonly customersRepository: CustomersRepository,
  ) {}

  public async create(
    name: string,
    email: string,
    phone: string,
    ) {
    const existingCustomer =
        await this.customersRepository.findByEmail(email);

    if (existingCustomer) {
        return existingCustomer;
    }

    return this.customersRepository.create({
        name,
        email,
        phone,
    });
    }
}