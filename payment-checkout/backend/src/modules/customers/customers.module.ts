import { Module } from '@nestjs/common';
import { CustomersRepository } from './repositories/customers.repository';
import { PrismaCustomersRepository } from './repositories/prisma-customers.repository';
import { CustomersService } from './services/customers.service';
import { CustomersController } from './controllers/customers.controller';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
  ],
  exports: [
    CustomersRepository,
    CustomersService,
  ],
})
export class CustomersModule {}