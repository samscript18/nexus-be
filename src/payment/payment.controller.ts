import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { CreatePaymentDto } from './dto/create-payment-dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }
  @Post('initiate')
  initiate(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(initiatePaymentDto);
  }

  @Get('verify-trx/:transaction_ref')
  async verify(@Param('transaction_ref') transaction_ref: string) {
    const transaction =
      await this.paymentService.verifyPayment(transaction_ref);
    if (transaction?.data?.transaction_status === 'success') {
      await this.paymentService.createPayment({
        tx_amount: transaction?.data?.transaction_amount,
        tx_ref: transaction?.data?.transaction_reference,
        tx_status: transaction?.data?.transaction_status,
        email: transaction?.data?.email,
        currency: transaction?.data?.transaction_currency_id,
      });
    }
    return transaction;
  }
}
