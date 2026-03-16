import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

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

const parseSameSite = (
  value: string | undefined,
): CookieOptions['sameSite'] => {
  if (!value) return 'lax';

  const normalized = value.trim().toLowerCase();
  if (normalized === 'none') return 'none';
  if (normalized === 'strict') return 'strict';

  return 'lax';
};

export const parseDurationToMs = (
  value: string | undefined,
  fallbackMs: number,
): number => {
  if (!value) return fallbackMs;

  const normalized = value.trim();
  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) {
    return numeric * 1000;
  }

  const match = normalized.match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * (multipliers[unit] ?? 1);
};

export const buildCookieOptions = (maxAgeMs: number): CookieOptions => ({
  httpOnly: true,
  sameSite: parseSameSite(process.env.COOKIE_SAME_SITE),
  secure: parseBoolean(process.env.COOKIE_SECURE, false),
  domain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  maxAge: maxAgeMs,
  path: '/',
});
