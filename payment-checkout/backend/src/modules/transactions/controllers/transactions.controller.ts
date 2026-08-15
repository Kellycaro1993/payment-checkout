import { Body, Controller, Post } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import {CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  public constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  public async create(
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(
      dto.productId,
      dto.customerId,
      dto.deliveryId,
      {
        customerEmail: dto.customerEmail,
        cardToken: dto.cardToken,
        installments: dto.installments,
        reference: dto.reference,
        acceptanceToken: dto.acceptanceToken,
        acceptPersonalAuth: dto.acceptPersonalAuth,
      },
    );
  }
}
