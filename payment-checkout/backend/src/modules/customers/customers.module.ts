import { Module } from '@nestjs/common';
import { CustomersRepository } from './repositories/customers.repository';
import { PrismaCustomersRepository } from './repositories/prisma-customers.repository';

@Module({
  providers: [
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
  ],
  exports: [CustomersRepository],
})
export class CustomersModule {}