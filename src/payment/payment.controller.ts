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
  verify(@Param('transaction_ref') transaction_ref: string) {
    return this.paymentService.verifyPayment(transaction_ref);
  }
}
