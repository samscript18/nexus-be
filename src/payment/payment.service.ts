import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment-dto';
import { Payment, PaymentDocument } from './schema/payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const payment: Payment = await this.paymentModel.create(createPaymentDto);
    return payment;
  }

  getAllPayments() {
    return this.paymentModel.find();
  }

  async initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    try {
      const tx_ref = v4();
      const transaction = await axios.post(
        `${this.configService.get<string>('testPaymentApiUrl')}/transaction/initiate`,
        {
          email: initiatePaymentDto.email,
          amount: 1011 * 100,
          currency: 'NGN',
          initiate_type: 'inline',
          transaction_ref: tx_ref,
          callback_url: `https://nexus-2024.vercel.app/dashboard/verify-trx/${tx_ref}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('testPaymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return transaction?.data;
    } catch (error) {
      console.log(error);

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
        ${this.configService.get<string>('testPaymentApiUrl')}/transaction/verify/${transaction_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('testPaymentApiKey')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const user: User = await this.userModel.findOne({
        email: transaction?.data?.data?.email,
      });
      if (!user) {
        throw new NotFoundException('User Not found');
      }

      if (transaction?.data?.data?.transaction_status === 'success') {
        await this.paymentModel.create({
          tx_amount: transaction?.data?.data?.transaction_amount,
          tx_ref: transaction?.data?.data?.transaction_ref,
          tx_status: transaction?.data?.data?.transaction_status,
          email: transaction?.data?.data?.email,
          currency: transaction?.data?.data?.transaction_currency_id,
        });
        await this.mailService.sendMail({
          to: user.email,
          subject: 'NEXUS 2024: Registration Successful',
          template: 'registration',
          context: {
            firstName: user.firstName,
          },
        });
      }

      return transaction?.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unable to verify payment', {
        cause: error,
      });
    }
  }
}
