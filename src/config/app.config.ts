import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  cookie: {
    domain: process.env.COOKIE_DOMAIN ?? 'localhost',
    secure:
      String(process.env.COOKIE_SECURE ?? 'false').toLowerCase() === 'true',
  },
}));

export type AppConfig = ReturnType<typeof appConfig>;
