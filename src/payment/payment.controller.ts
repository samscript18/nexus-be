import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('verify-trx/:transaction_ref')
  verify(@Param('transaction_ref') transaction_ref: string) {
    return this.paymentService.verifyPayment(transaction_ref);
  }
}
