import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Đổi thành host SMTP của bạn
      port: 587, // Đổi thành port SMTP của bạn
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'yourmail', // Đổi thành email của bạn
        pass: 'yourpassword', // Đổi thành mật khẩu email của bạn
      },
    });
  }

  async sendUserConfirmation(email: string, token: string) {
    const url = `http://localhost:3000/api/v1/auth/confirm?token=${token}`;

    await this.transporter.sendMail({
      from: '"NestJS App" <your-email@example.com>', // Đổi thành email của bạn
      to: email,
      subject: 'Welcome to NestJS App! Confirm your Email',
      html: `Click <a href="${url}">here</a> to confirm your email.`,
    });
  }
}
