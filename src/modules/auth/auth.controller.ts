import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  buildCookieOptions,
  parseDurationToMs,
} from './auth.cookies';
import { parseCookies } from './auth.utils';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { toUserResponse } from '../users/users.mapper';

type LoginBody = {
  ci?: unknown;
  password?: unknown;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return toUserResponse(user);
  }

  @Post('login')
  async login(
    @Body() body: LoginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawCi = typeof body.ci === 'string' ? body.ci.trim() : '';
    const rawPassword = typeof body.password === 'string' ? body.password : '';

    if (!rawCi && !rawPassword) {
      return res.status(400).json({
        message: 'Debe completar los campos obligatorios',
        fieldErrors: {
          ci: 'La CI es obligatoria',
          password: 'La contrasena es obligatoria',
        },
      });
    }

    if (!rawCi) {
      return res.status(400).json({
        message: 'La CI es obligatoria',
        field: 'ci',
      });
    }

    if (!rawPassword) {
      return res.status(400).json({
        message: 'La contrasena es obligatoria',
        field: 'password',
      });
    }

    const user = await this.authService.findUserByIdentityNumber(rawCi);
    if (!user) {
      return res.status(401).json({
        message: 'La CI no existe en el sistema',
        field: 'ci',
      });
    }

    const passwordValid = await this.authService.verifyPassword(
      user,
      rawPassword,
    );
    if (!passwordValid) {
      return res.status(401).json({
        message: 'La contrasena es incorrecta',
        field: 'password',
      });
    }

    const { accessToken, refreshToken, user: userPayload, clinician } =
      await this.authService.issueAuthTokens(user);

    const accessMaxAgeMs = parseDurationToMs(
      process.env.JWT_ACCESS_EXPIRES_IN,
      60 * 60 * 1000,
    );
    const refreshMaxAgeMs = parseDurationToMs(
      process.env.JWT_REFRESH_EXPIRES_IN,
      7 * 24 * 60 * 60 * 1000,
    );

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      buildCookieOptions(accessMaxAgeMs),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      buildCookieOptions(refreshMaxAgeMs),
    );

    return {
      user: userPayload,
      clinician,
    };
  }

  @Get('me')
  async me(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = parseCookies(req.headers.cookie);
    const accessTokenFromCookie = cookies[ACCESS_TOKEN_COOKIE_NAME];

    const authHeader = req.headers.authorization ?? '';
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : null;

    const accessToken = accessTokenFromCookie || bearerToken;
    if (!accessToken) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const session = await this.authService.getSessionFromToken(accessToken);
    if (!session) {
      res.cookie(ACCESS_TOKEN_COOKIE_NAME, '', {
        ...buildCookieOptions(0),
        expires: new Date(0),
      });

      return res.status(401).json({ message: 'Sesion invalida' });
    }

    return session;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const expired = {
      ...buildCookieOptions(0),
      expires: new Date(0),
    };

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, '', expired);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', expired);

    return { ok: true };
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }
}
