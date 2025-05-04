import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../database/models/invoice.schema';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Cron('0 12 * * *')
  async generateDailyReport() {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const invoices = await this.invoiceModel.find({
      date: { $gte: start, $lte: end },
    });

    const totalSales = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    const skuMap: Record<string, number> = {};
    invoices.forEach((inv) => {
      inv.items.forEach((item) => {
        skuMap[item.sku] = (skuMap[item.sku] || 0) + item.qt;
      });
    });

    const report = {
      date: new Date().toISOString().split('T')[0],
      totalSales,
      itemsSold: Object.entries(skuMap).map(([sku, qt]) => ({ sku, qt })),
    };

    this.logger.log(`Sending report to RabbitMQ`);
    await this.client.emit(process.env.RABBITMQ_QUEUE, report).toPromise();
  }
}
