import { Module } from '@nestjs/common';
import { TransactionsRepository } from './repositories/transactions.repository';
import { PrismaTransactionsRepository } from './repositories/prisma-transactions.repository';
import { PaymentModule } from '../../infrastructure/integrations/payment/payment.module';
import { PrismaModule } from '../../infrastructure/database/prisma/prisma.module';
import { TransactionsService } from './services/transactions.service';
@Module({
    imports: [PaymentModule, PrismaModule],
    providers: [
        {
        provide: TransactionsRepository,
        useClass: PrismaTransactionsRepository,
        },
        TransactionsService,
    ],
    exports: [TransactionsRepository, TransactionsService],
})
export class TransactionsModule {}
