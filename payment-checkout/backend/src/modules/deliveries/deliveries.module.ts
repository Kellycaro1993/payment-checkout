import { Module } from '@nestjs/common';
import { DeliveriesRepository } from './repositories/deliveries.repository';
import { PrismaDeliveriesRepository } from './repositories/prisma-deliveries.repository';
import { DeliveriesService } from './services/deliveries.service';
import { DeliveriesController } from './controllers/deliveries.controller';
@Module({
  controllers: [DeliveriesController],
  providers: [
    DeliveriesService,
    {
      provide: DeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
  ],
  exports: [
    DeliveriesRepository,
    DeliveriesService,
  ],
})
export class DeliveriesModule {}