import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoiceService } from './common/utils/invoice.service';
import { InvoiceModule } from './modules/invoice/invoice.module';

// We need to import the dotenv package to load environment variables from a .env file
import * as dotenv from 'dotenv';
const envPath = process.cwd() + '/.env.' + process.env.NODE_ENV;
dotenv.config({ path: envPath });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
    InvoiceModule,
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, InvoiceService],
})
export class AppModule {}
