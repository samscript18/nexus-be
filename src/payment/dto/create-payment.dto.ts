import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsNumber()
  // @IsNotEmpty()
  // amount: number;

  // @IsString()
  // @IsNotEmpty()
  // currency: string;

  // @IsString()
  // @IsNotEmpty()
  // callback_url: string;
}
