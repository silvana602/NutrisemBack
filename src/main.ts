import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { buildCorsOptions } from './common/config/cors.config';
import { getFirstLanIpv4 } from './common/utils/network.utils';
import { AppModule } from './app.module';

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiPrefix = process.env.API_PREFIX ?? 'api';
  app.setGlobalPrefix(apiPrefix);
  app.enableCors(buildCorsOptions());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = parsePort(process.env.PORT, 4000);
  const host = process.env.APP_HOST ?? '0.0.0.0';
  await app.listen(port, host);

  const localIp = getFirstLanIpv4();
  const normalizedPrefix = apiPrefix.startsWith('/')
    ? apiPrefix
    : `/${apiPrefix}`;

  // Helpful logs for mobile development (Expo/React Native).
  console.log(`API local: http://localhost:${port}${normalizedPrefix}`);
  if (localIp) {
    console.log(`API LAN  : http://${localIp}:${port}${normalizedPrefix}`);
  }
}

void bootstrap();
