import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  tx_amount: number;

  @IsString()
  @IsNotEmpty()
  tx_ref: string;

  @IsString()
  @IsNotEmpty()
  tx_status: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
