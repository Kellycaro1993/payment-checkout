import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @Min(1)
  public productId!: number;

  @IsInt()
  @Min(1)
  public customerId!: number;

  @IsInt()
  @Min(1)
  public deliveryId!: number;

  @IsEmail()
  @IsNotEmpty()
  public customerEmail!: string;

  @IsString()
  @IsNotEmpty()
  public cardToken!: string;

  @IsInt()
  @Min(1)
  public installments!: number;

  @IsString()
  @IsNotEmpty()
  public reference!: string;

  @IsString()
  @IsNotEmpty()
  public acceptanceToken!: string;

  @IsString()
  @IsNotEmpty()
  public acceptPersonalAuth!: string;
}
