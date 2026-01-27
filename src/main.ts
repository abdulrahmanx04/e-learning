import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {  ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';
import * as express from 'express';
import helmet from 'helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/payments/webhook',
    express.raw({ type: 'application/json' })
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))
  app.use(helmet())
  app.enableCors({
      origin: process.env.FRONTEND_URL,
      credential: true
  })

  const config = new DocumentBuilder()
    .setTitle('E-Learning API')
    .setDescription('API documentation for E-Learning platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter(), new TypeOrmExceptionFilter())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
