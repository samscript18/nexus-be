import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMail } from './interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(dto: SendMail) {
    const { to, template, context, subject } = dto;
    try {
      await this.mailerService.sendMail({
        from: 'noreply@nexus-2024.vercel.app',
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
