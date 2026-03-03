import { registerAs } from '@nestjs/config';

function parseDuration(value: string | undefined, fallback: string): string {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

export const jwtConfig = registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET ?? 'replace_me_access_secret',
    expiresIn: parseDuration(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET ?? 'replace_me_refresh_secret',
    expiresIn: parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
  },
}));

export type JwtConfig = ReturnType<typeof jwtConfig>;
