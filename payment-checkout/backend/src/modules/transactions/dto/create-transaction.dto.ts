import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionItemDto {
  @IsInt()
  @Min(1)
  public productId!: number;

  @IsInt()
  @Min(1)
  public quantity!: number;
}

export class CreateTransactionDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  public items!: CreateTransactionItemDto[];

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
