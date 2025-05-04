import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../../database/models/invoice.schema';
import { CreateInvoiceDto, GetInvoicesDto } from '../../common/dto/invoice.dto';
import * as messages from '../../common/static/messages.json';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<{ data: Invoice; message: string }> {
    const skus = createInvoiceDto.items.map((item) => item.sku);

    const existingInvoices = await this.invoiceModel.find({
      'items.sku': { $in: skus },
    });

    // If any SKU already exists, throw an error
    if (existingInvoices && existingInvoices.length > 0) {
      const existingSkus = existingInvoices.flatMap((invoice) => invoice.items.map((item) => item.sku));
      const duplicateSkus = skus.filter((sku) => existingSkus.includes(sku));
      if (duplicateSkus.length > 0) {
        throw new ConflictException(`Duplicate SKUs found: ${duplicateSkus.join(', ')}`);
      }
    }

    const invoice = new this.invoiceModel(createInvoiceDto);
    const createdInvoice = await invoice.save();

    return {
      data: createdInvoice,
      message: messages.DATA_CREATED,
    };
  }

  async findById(id: string): Promise<{ data: Invoice; message: string }> {
    const checkObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!checkObjectId) {
      throw new HttpException(messages.INVALID_OBJECT_ID, HttpStatus.BAD_REQUEST);
    }

    const invoice = await this.invoiceModel.findById(id).exec(); // Added .exec() for consistency
    if (!invoice) {
      throw new NotFoundException(messages.DATA_NOT_FOUND);
    }

    return {
      data: invoice,
      message: messages.DATA_FOUND,
    };
  }

  async findAll(getInvoicesDto: GetInvoicesDto): Promise<{ data: Invoice[]; message: string }> {
    const filter: any = {};

    if (getInvoicesDto.startDate || getInvoicesDto.endDate) {
      filter.date = {};
      if (getInvoicesDto.startDate) filter.date.$gte = new Date(getInvoicesDto.startDate);
      if (getInvoicesDto.endDate) filter.date.$lte = new Date(getInvoicesDto.endDate);
    }

    const invoices = await this.invoiceModel.find(filter).exec();
    return {
      data: invoices,
      message: messages.DATA_RETRIEVED,
    };
  }
}
