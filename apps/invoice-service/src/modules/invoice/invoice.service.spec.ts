import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from '../../database/models/invoice.schema';
import { Model, Types } from 'mongoose';
import * as messages from '../../common/static/messages.json';

const mockInvoice = {
  customer: 'John Doe',
  amount: 100,
  reference: 'INV-001',
  date: new Date(),
  items: [{ sku: 'ABC123', qt: 2 }],
};

const mockInvoiceCreatedResponse = {
  data: mockInvoice,
  message: messages.DATA_CREATED,
};

const mockInvoiceResponse = {
  data: mockInvoice,
  message: messages.DATA_FOUND,
};

const mockInvoicesResponse = {
  data: [mockInvoice],
  message: messages.DATA_RETRIEVED,
};

const mockGetInvoicesDto = { startDate: null, endDate: null };

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;

  const mockSave = jest.fn().mockResolvedValue(mockInvoice);

  const mockModel = jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: Object.assign(mockModel, {
            find: jest.fn(),
            findById: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  it('should create an invoice', async () => {
    const result = await service.create(mockInvoice as any);
    expect(result).toEqual(mockInvoiceCreatedResponse);
    expect(model).toHaveBeenCalledWith(mockInvoice); // constructor called
  });

  it('should retrieve an invoice by ID', async () => {
    const id = new Types.ObjectId().toHexString();
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockInvoice),
    } as any);
    const result = await service.findById(id);
    expect(result).toEqual(mockInvoiceResponse);
  });

  it('should retrieve all invoices', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockInvoice]),
    } as any);
    const result = await service.findAll(mockGetInvoicesDto);
    expect(result).toEqual(mockInvoicesResponse);
  });
});
