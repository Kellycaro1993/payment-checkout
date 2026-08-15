import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { DeliveriesService } from '../services/deliveries.service';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  public constructor(
    private readonly deliveriesService: DeliveriesService,
  ) {}

  @Post()
  @ApiBody({ type: CreateDeliveryDto })
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
