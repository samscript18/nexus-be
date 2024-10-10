import { IsEmail, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
