import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { DeliveriesService } from '../services/deliveries.service';

@Controller('deliveries')
export class DeliveriesController {
  public constructor(
    private readonly deliveriesService: DeliveriesService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateDeliveryDto,
  ) {
    return this.deliveriesService.create(
      dto.address,
      dto.city,
      dto.customerId,
    );
  }
}