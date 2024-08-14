import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly paymentService: PaymentService,
  ) {}
  async createUser<T>(data: T) {
    let user: User;
    try {
      user = await this.userModel.create(data);
    } catch (error) {
      throw new BadRequestException('User already exists', { cause: error });
    }
    await this.mailService.sendMail({
      to: user.email,
      subject: 'NEXUS 2024: Registration Successful',
      template: 'registration',
      context: {
        firstName: user.firstName,
      },
    });

    const checkout_url = await this.paymentService.createPayment({
      email: user.email,
    });
    return checkout_url;
  }

  findUsers() {
    return this.userModel.find();
  }

  async findUser(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
}
