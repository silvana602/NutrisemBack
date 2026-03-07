import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const splitAndTrim = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const parseBoolean = (
  value: string | undefined,
  fallback: boolean,
): boolean => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

const getAllowedOrigins = (): string[] => {
  const origins = new Set<string>();

  const fromList = process.env.CORS_ORIGINS;
  if (fromList) {
    splitAndTrim(fromList).forEach((origin) => origins.add(origin));
  }

  const fromLegacy = process.env.CORS_ORIGIN;
  if (fromLegacy) {
    splitAndTrim(fromLegacy).forEach((origin) => origins.add(origin));
  }

  return [...origins];
};

export const buildCorsOptions = (): CorsOptions => {
  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';
  const allowAllInDev = parseBoolean(process.env.CORS_ALLOW_ALL_DEV, true);
  const allowCredentials = parseBoolean(process.env.CORS_CREDENTIALS, true);
  const allowedOrigins = getAllowedOrigins();

  if (isDev && allowAllInDev) {
    return {
      origin: true,
      credentials: allowCredentials,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  return {
    credentials: allowCredentials,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: (origin, callback) => {
      // Mobile native clients and curl/postman may send requests without Origin.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
  };
};
