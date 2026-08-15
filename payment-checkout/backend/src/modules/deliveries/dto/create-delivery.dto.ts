import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'Calle 123 # 45-67', description: 'Dirección de entrega' })
  @IsString()
  @IsNotEmpty()
  public address!: string;

  @ApiProperty({ example: 'Bogotá', description: 'Ciudad de entrega' })
  @IsString()
  @IsNotEmpty()
  public city!: string;

  @ApiProperty({ example: 1, description: 'Identificador del cliente' })
  @IsInt()
  public customerId!: number;
}
