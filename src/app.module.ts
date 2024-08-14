import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          uri: configService.get<string>('mongoUri'),
        };
      },
    }),
    MailModule,
    PaymentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
