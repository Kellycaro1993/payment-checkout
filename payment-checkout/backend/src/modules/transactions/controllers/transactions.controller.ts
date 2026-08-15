import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {
  public constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get()
  public async findAll() {
    return this.transactionsService.getTransactions();
  }

  @Get(':id')
  public async findById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.transactionsService.getTransactionById(id);
  }

  @Post()
  public async create(
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(
      dto.items,
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
