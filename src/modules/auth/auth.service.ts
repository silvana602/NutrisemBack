import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StringValue } from 'ms';
import { UserRole } from 'src/common/enums/role.enum';
import { User } from 'src/database/entities';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<User> {
    const hash = await bcrypt.hash(
      payload.password,
      parseNumericEnv(process.env.BCRYPT_SALT_ROUNDS, 10),
    );

    return this.usersService.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      identityNumber: payload.identityNumber,
      email: payload.email ?? null,
      phone: payload.phone,
      address: payload.address,
      role: payload.role ?? UserRole.PATIENT,
      passwordHash: hash,
    });
  }

  async login(payload: LoginDto) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.issueAuthTokens(user);
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

  private async issueAuthTokens(user: User) {
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

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
