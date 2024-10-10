import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { PaymentService } from 'src/payment/payment.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly paymentService: PaymentService,
  ) {}
  async createUser(data: CreateUserDto) {
    let user: User;
    try {
      user = await this.userModel.create(data);
    } catch (error) {
      await this.userModel.findOneAndDelete({ email: data.email });
      user = await this.userModel.create(data);
    }

    const transaction = await this.paymentService.initiatePayment({
      email: user.email,
    });
    return transaction?.data.checkout_url;
  }

  findUsers() {
    return this.userModel.find();
  }

  async findUser(id: string) {
    const user = await this.userModel.findById(id);
    return user;
  }
}
