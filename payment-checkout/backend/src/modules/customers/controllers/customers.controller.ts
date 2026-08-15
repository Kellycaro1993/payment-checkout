import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomersService } from '../services/customers.service';

@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(
      dto.name,
      dto.email,
      dto.phone,
    );
  }
}