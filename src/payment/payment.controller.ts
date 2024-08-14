import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  create(@Body() createPaymentDto: CreatePaymentDto, @Res() res: Response) {
    const transaction_ref = this.paymentService.createPayment(createPaymentDto);
    res.redirect(
      `https://nexus-2024.vercel.app/dashboard/verify-trx/${transaction_ref}`,
    );
  }

  @Get('verify-trx/:transaction_ref')
  verify(@Param('transaction_ref') transaction_ref: string) {
    return this.paymentService.verifyPayment(transaction_ref);
  }
}
