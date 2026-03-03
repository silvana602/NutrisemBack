import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function toBool(value: string | undefined, fallback = false): boolean {
  if (value == null || value.trim() === '') return fallback;
  return value.toLowerCase() === 'true';
}

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
    const sslEnabled = toBool(process.env.DB_SSL, false);

    return {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: toNumber(process.env.DB_PORT, 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'nutrisem',
      autoLoadEntities: true,
      synchronize: false,
      logging: !isProd,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    };
  },
);

export type DatabaseConfig = ReturnType<typeof databaseConfig>;
