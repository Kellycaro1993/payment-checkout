import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'María Pérez', description: 'Nombre completo del cliente' })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({ example: 'maria.perez@example.com', description: 'Correo electrónico del cliente' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: '3001234567', description: 'Número de teléfono del cliente' })
  @IsString()
  @IsNotEmpty()
  public phone!: string;
}
