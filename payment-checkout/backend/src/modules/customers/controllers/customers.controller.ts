import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  @ApiBody({ type: CreateCustomerDto })
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
