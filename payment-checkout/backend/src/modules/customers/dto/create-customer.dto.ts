import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public phone!: string;
}