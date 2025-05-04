import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderController } from './email-sender.controller';
import { EmailSenderService } from './email-sender.service';

describe('EmailSenderController', () => {
  let controller: EmailSenderController;
  let service: EmailSenderService;

  const mockService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailSenderController],
      providers: [
        {
          provide: EmailSenderService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EmailSenderController>(EmailSenderController);
    service = module.get<EmailSenderService>(EmailSenderService);
  });

  it('should call sendEmail with the report payload', async () => {
    const report = {
      date: '2025-05-03',
      totalSales: 1500,
      itemsSold: [
        { sku: 'SKU123', qt: 3 },
        { sku: 'SKU456', qt: 2 },
      ],
    };

    await controller.handleDailySalesReport(report);

    expect(service.sendEmail).toHaveBeenCalledWith(report);
  });
});
