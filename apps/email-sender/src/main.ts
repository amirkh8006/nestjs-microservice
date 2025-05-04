// We need to import the dotenv package to load environment variables from a .env file
import * as dotenv from 'dotenv';
const envPath = process.cwd() + '/.env.' + process.env.NODE_ENV;
dotenv.config({ path: envPath });

import { NestFactory } from '@nestjs/core';
import { EmailSenderModule } from './email-sender.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EmailSenderModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.listen();
  console.log('Email Sender Microservice is listening');
}
bootstrap();
