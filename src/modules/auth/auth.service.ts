import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import { UserRole } from 'src/common/enums/role.enum';
import { User } from 'src/database/entities';
import { CliniciansService } from '../clinicians/clinicians.service';
import { toClinicianResponse } from '../clinicians/clinicians.mapper';
import { toUserResponse } from '../users/users.mapper';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.estrategy';

const parseNumericEnv = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseExpiresIn = (
  value: string | undefined,
  fallback: StringValue,
): StringValue => (value as StringValue | undefined) ?? fallback;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cliniciansService: CliniciansService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    return this.usersService.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      identityNumber: payload.identityNumber,
      email: payload.email ?? null,
      phone: payload.phone,
      address: payload.address,
      role: payload.role ?? UserRole.PATIENT,
      password: payload.password,
    });
  }

  async findUserByIdentityNumber(identityNumber: string): Promise<User | null> {
    return this.usersService.findByIdentityNumber(identityNumber);
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async refreshTokens(payload: RefreshTokenDto) {
    let decoded: JwtPayload;
    try {
      decoded = await this.jwtService.verifyAsync<JwtPayload>(
        payload.refreshToken,
        {
          secret:
            process.env.JWT_REFRESH_SECRET ??
            process.env.JWT_SECRET ??
            'super_secret_key',
        },
      );
    } catch {
      throw new UnauthorizedException('Refresh token invalido');
    }

    const user = await this.usersService.findByUserId(decoded.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.issueAuthTokens(user);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret:
          process.env.JWT_ACCESS_SECRET ??
          process.env.JWT_SECRET ??
          'super_secret_key',
      });
    } catch {
      return null;
    }
  }

  async getSessionFromToken(token: string) {
    const decoded = await this.verifyAccessToken(token);
    if (!decoded) return null;

    const user = await this.usersService.findByUserId(decoded.sub);
    if (!user || user.role !== decoded.role) {
      return null;
    }

    return this.buildSessionResponse(user);
  }

  async issueAuthTokens(user: User) {
    const jwtPayload: JwtPayload = {
      sub: user.userId,
      email: user.email ?? '',
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret:
        process.env.JWT_ACCESS_SECRET ??
        process.env.JWT_SECRET ??
        'super_secret_key',
      expiresIn: parseExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN, '15m'),
    });

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret:
        process.env.JWT_REFRESH_SECRET ??
        process.env.JWT_SECRET ??
        'super_secret_key',
      expiresIn: parseExpiresIn(process.env.JWT_REFRESH_EXPIRES_IN, '7d'),
    });

    const session = await this.buildSessionResponse(user);

    return {
      accessToken,
      refreshToken,
      ...session,
    };
  }

  private async buildSessionResponse(user: User) {
    const clinician =
      user.role === UserRole.CLINICIAN
        ? await this.cliniciansService.findByUserId(user.userId)
        : null;

    return {
      user: toUserResponse(user),
      clinician: clinician ? toClinicianResponse(clinician) : null,
    };
  }
}
