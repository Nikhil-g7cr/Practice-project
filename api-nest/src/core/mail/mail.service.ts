import { Injectable } from '@nestjs/common';

export interface IMailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface IMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

@Injectable()
export class MailService {
  private config: IMailConfig;

  constructor() {
    this.config = {
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASS || '',
      from: process.env.MAIL_FROM || '',
    };
  }

  async sendMail(options: IMailOptions): Promise<void> {
    // TODO: Implement mail sending logic
    console.log('Mail service initialized. Configure with your mail provider.');
  }
}
