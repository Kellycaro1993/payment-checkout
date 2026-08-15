import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNumber()
  @IsNotEmpty()
  deliveryId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @IsString()
  @IsNotEmpty()
  cardExpiration: string;

  @IsString()
  @IsNotEmpty()
  cardCvv: string;
}
