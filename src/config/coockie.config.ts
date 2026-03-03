import { registerAs } from '@nestjs/config';

function toBool(value: string | undefined, fallback = false): boolean {
  if (value == null || value.trim() === '') return fallback;
  return value.toLowerCase() === 'true';
}

export const coockieConfig = registerAs('coockie', () => ({
  domain: process.env.COOKIE_DOMAIN ?? 'localhost',
  secure: toBool(process.env.COOKIE_SECURE, false),
  httpOnly: true,
  sameSite: (process.env.COOKIE_SAME_SITE ?? 'lax') as
    | 'lax'
    | 'strict'
    | 'none',
  path: '/',
}));

export type CoockieConfig = ReturnType<typeof coockieConfig>;
