import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from './email-sender.service';
import * as sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail');

describe('EmailSenderService', () => {
  let service: EmailSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSenderService],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email via SendGrid', async () => {
    const report = {
      date: '2025-05-03',
      totalSales: 500,
      itemsSold: [{ sku: 'ABC123', qt: 10 }],
    };

    const mockSend = jest.fn().mockResolvedValue({ statusCode: 202 });
    (sgMail.send as jest.Mock) = mockSend;

    process.env.SENDGRID_SENDER = 'sender@example.com';
    process.env.SENDGRID_RECIPIENT = 'recipient@example.com';

    await service.sendEmail(report);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'recipient@example.com',
        from: 'sender@example.com',
        subject: `Daily Sales Report - 2025-05-03`,
      }),
    );
  });

  it('should log an error if SendGrid fails', async () => {
    const error = new Error('Send failed');
    (sgMail.send as jest.Mock).mockRejectedValue(error);

    const report = {
      date: '2025-05-03',
      totalSales: 300,
      itemsSold: [],
    };

    await expect(service.sendEmail(report)).resolves.toBeUndefined();
  });
});
