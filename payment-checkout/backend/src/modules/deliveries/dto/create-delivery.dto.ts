import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  public address!: string;

  @IsString()
  @IsNotEmpty()
  public city!: string;

  @IsInt()
  public customerId!: number;
}
