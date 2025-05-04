import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailSenderService } from './email-sender.service';

@Controller()
export class EmailSenderController {
  private readonly logger = new Logger(EmailSenderController.name);

  constructor(private readonly emailService: EmailSenderService) {}

  @EventPattern(process.env.RABBITMQ_QUEUE)
  async handleDailySalesReport(@Payload() report: any) {
    this.logger.log('Received daily sales report', report);
    await this.emailService.sendEmail(report);
  }
}
