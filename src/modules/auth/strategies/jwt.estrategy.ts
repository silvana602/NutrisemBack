/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserRole } from 'src/common/enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: (request: Request): string | null => {
        const authorization = request.headers.authorization;
        if (!authorization) {
          return null;
        }

        const [scheme, token] = authorization.split(' ');
        if (!token || scheme.toLowerCase() !== 'bearer') {
          return null;
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ??
        configService.get<string>('JWT_SECRET', 'super_secret_key'),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
