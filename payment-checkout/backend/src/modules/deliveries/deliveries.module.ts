import { Module } from '@nestjs/common';
import { DeliveriesRepository } from './repositories/deliveries.repository';
import { PrismaDeliveriesRepository } from './repositories/prisma-deliveries.repository';

@Module({
  providers: [
    {
      provide: DeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
  ],
  exports: [DeliveriesRepository],
})
export class DeliveriesModule {}