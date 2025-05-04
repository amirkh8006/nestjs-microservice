import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(report: any) {
    const sender = process.env.SENDGRID_SENDER;
    const recipient = process.env.SENDGRID_RECIPIENT;

    const htmlContent = `
      <h1>Daily Sales Report - ${report.date}</h1>
      <p><strong>Total Sales: </strong>${report.totalSales}</p>
      <h3>Items Sold:</h3>
      <ul>
        ${report.itemsSold.map((item: any) => `<li><strong>SKU:</strong> ${item.sku}, <strong>Quantity:</strong> ${item.qt}</li>`).join('')}
      </ul>
    `;

    const msg = {
      to: recipient,
      from: sender,
      subject: `Daily Sales Report - ${report.date}`,
      html: htmlContent,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`SendGrid: Email sent successfully to ${recipient}`);
    } catch (error) {
      this.logger.error('SendGrid: Failed to send email');
      this.logger.error(error?.response?.body || error.message);
    }
  }
}
