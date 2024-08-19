import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}
  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const tx_ref = v4();
      const transaction = await axios.post(
        `${this.configService.get<string>('paymentApiUrl')}/transaction/initiate`,
        {
          email: createPaymentDto.email,
          amount: 1011 * 100,
          currency: 'NGN',
          initiate_type: 'inline',
          transaction_ref: tx_ref,
          callback_url: `https://nexus-2024.vercel.app/dashboard/verify-trx/${tx_ref}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('paymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return transaction?.data;
    } catch (error) {
      throw new BadRequestException(
        'Unable to initialize payment transaction',
        {
          cause: error,
        },
      );
    }
  }

  async verifyPayment(transaction_ref: string) {
    try {
      const transaction = await axios.get(
        `
        ${this.configService.get<string>('paymentApiUrl')}/transaction/verify/${transaction_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('paymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return transaction?.data;
    } catch (error) {
      throw new BadRequestException('Unable to verify payment', {
        cause: error,
      });
    }
  }
}
