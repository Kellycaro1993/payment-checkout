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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionItemDto {
  @ApiProperty({ example: 1, description: 'Identificador del producto' })
  @IsInt()
  @Min(1)
  public productId!: number;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades del producto' })
  @IsInt()
  @Min(1)
  public quantity!: number;
}

export class CreateTransactionDto {
  @ApiProperty({
    type: [CreateTransactionItemDto],
    example: [{ productId: 1, quantity: 2 }],
    description: 'Productos y cantidades incluidos en el pago',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  public items!: CreateTransactionItemDto[];

  @ApiProperty({ example: 1, description: 'Identificador del cliente' })
  @IsInt()
  @Min(1)
  public customerId!: number;

  @ApiProperty({ example: 1, description: 'Identificador de la entrega' })
  @IsInt()
  @Min(1)
  public deliveryId!: number;

  @ApiProperty({ example: 'maria.perez@example.com', description: 'Correo del pagador' })
  @IsEmail()
  @IsNotEmpty()
  public customerEmail!: string;

  @ApiProperty({ example: 'tok_test_...', description: 'Token de tarjeta generado por Wompi' })
  @IsString()
  @IsNotEmpty()
  public cardToken!: string;

  @ApiProperty({ example: 1, minimum: 1, description: 'Número de cuotas' })
  @IsInt()
  @Min(1)
  public installments!: number;

  @ApiProperty({ example: 'checkout-001', description: 'Referencia única de la transacción' })
  @IsString()
  @IsNotEmpty()
  public reference!: string;

  @ApiProperty({ example: 'acceptance-token', description: 'Token de aceptación de términos de Wompi' })
  @IsString()
  @IsNotEmpty()
  public acceptanceToken!: string;

  @ApiProperty({ example: 'personal-data-token', description: 'Token de autorización de datos personales' })
  @IsString()
  @IsNotEmpty()
  public acceptPersonalAuth!: string;
}
