import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailSenderController } from './email-sender.controller';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
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
  providers: [EmailSenderService],
  controllers: [EmailSenderController],
})
export class EmailSenderModule {}
