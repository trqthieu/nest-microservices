import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send_email')
  async sendEmail(data: { email: string; token: string }) {
    const { email, token } = data;
    console.log('send mail service');

    await this.mailService.sendUserConfirmation(email, token);
  }
}
