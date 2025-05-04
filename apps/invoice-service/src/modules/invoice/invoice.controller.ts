import { Controller, Post, Body, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, GetInvoicesDto } from '../../common/dto/invoice.dto';
import { Invoice } from '../../database/models/invoice.schema';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<{ data: Invoice; message: string }> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<{ data: Invoice; message: string }> {
    return this.invoiceService.findById(id);
  }

  @Get()
  findAll(@Query(new ValidationPipe({ transform: true })) getInvoicesDto: GetInvoicesDto): Promise<{ data: Invoice[]; message: string }> {
    return this.invoiceService.findAll(getInvoicesDto);
  }
}
