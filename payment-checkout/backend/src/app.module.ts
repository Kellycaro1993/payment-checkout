import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
@Module({
  imports: [
  PrismaModule,
  ProductsModule,
  TransactionsModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}