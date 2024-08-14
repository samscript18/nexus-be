import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}
  async createPayment(createPaymentDto: CreatePaymentDto) {
    let transaction;
    try {
      transaction = await axios.post(
        `
        ${this.configService.get<string>('paymentApiUrl')}/transaction/initiate`,
        {
          email: createPaymentDto.email,
          amount: 1000 * 100,
          currency: 'NGN',
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('paymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return transaction?.data?.transaction_ref;
    } catch (error) {
      throw new BadRequestException('Unable to initialize payment', {
        cause: error,
      });
    }
  }

  async verifyPayment(transaction_ref: string) {
    let transaction;
    try {
      transaction = await axios.get(
        `
        ${this.configService.get<string>('paymentApiUrl')}/transaction/verify/${transaction_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('paymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return transaction;
    } catch (error) {
      throw new BadRequestException('Unable to verify payment', {
        cause: error,
      });
    }
  }
}
