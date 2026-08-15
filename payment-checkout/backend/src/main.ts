import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Payment Checkout API')
    .setDescription(
      'API for products, customers, deliveries and payment transactions.',
    )
    .setVersion('1.0')
    .addTag('products')
    .addTag('customers')
    .addTag('deliveries')
    .addTag('transactions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup(
    'api',
    app,
    swaggerDocument,
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();