import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const { productId, customerId, deliveryId, ...paymentData } = createTransactionDto;

    return this.transactionsService.createTransaction(
      productId,
      customerId,
      deliveryId,
      paymentData,
    );
  }

  @Get(':id')
  async getTransaction(
    @Param('id', ParseIntPipe) id: number,
  ) {
    // TODO: Implement getTransaction
  }
}
