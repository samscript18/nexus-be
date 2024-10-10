import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigins = [
    'http://localhost:3000',
    'https://nexus-2024.vercel.app',
  ];

  app.use(express.json({ limit: '30mb' }));
  app.disable('x-powered-by');
  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port') || 3000);
}
bootstrap();
