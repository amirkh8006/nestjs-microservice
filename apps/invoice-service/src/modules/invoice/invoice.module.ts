import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../../database/models/invoice.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])],
  providers: [InvoiceService],
  controllers: [InvoiceController],
  exports: [InvoiceService, MongooseModule], // Export MongooseModule if needed elsewhere
})
export class InvoiceModule {}
