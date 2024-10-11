import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Payment {
  @Prop({ required: true })
  tx_amount: number;

  @Prop({ required: true })
  tx_ref: string;

  @Prop({ required: true })
  tx_status: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  currency: string;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
