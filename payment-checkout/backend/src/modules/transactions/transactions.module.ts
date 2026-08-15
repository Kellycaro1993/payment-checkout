import { Module } from '@nestjs/common';
import { TransactionsRepository } from './repositories/transactions.repository';
import { PrismaTransactionsRepository } from './repositories/prisma-transactions.repository';
import { PaymentModule } from '../../infrastructure/integrations/payment/payment.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { TransactionsService } from './services/transactions.service';
import { ProductsModule } from '../products/products.module';
import { TransactionsController } from './controllers/transactions.controller';
import { CustomersModule } from '../customers/customers.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
@Module({
    imports: [
        PaymentModule,
        PrismaModule,
        ProductsModule,
        CustomersModule,
        DeliveriesModule,
    ],
    providers: [
        {
        provide: TransactionsRepository,
        useClass: PrismaTransactionsRepository,
        },
        TransactionsService,
    ],
    exports: [TransactionsRepository, TransactionsService], 
    controllers: [TransactionsController],
})
export class TransactionsModule {}
