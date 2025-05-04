import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import * as messages from './common/static/messages.json';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable the default x-powered-by header
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Use Compression middleware
  app.use(compression());

  // Use Global Pipes for Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: () => {
        return new BadRequestException(messages.INVALID_DATA);
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
