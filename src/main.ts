import cookieParser from 'cookie-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 4000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const corsOrigin = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:3000',
  );

  app.setGlobalPrefix(apiPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(port);
}

void bootstrap();
