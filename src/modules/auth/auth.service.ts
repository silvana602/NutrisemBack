import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { StringValue } from 'ms';
import { IsNull, Repository } from 'typeorm';
import { UserRole } from 'src/common/enums/role.enum';
import { PasswordReset, User } from 'src/database/entities';
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

const parseDurationToMs = (
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

const DEFAULT_RECOVERY_TTL_MS = 10 * 60 * 1000;

const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4).padStart(4, '0');
  return `***${last4}`;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cliniciansService: CliniciansService,
    private readonly jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
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
      expiresIn: parseExpiresIn(process.env.JWT_ACCESS_EXPIRES_IN, '30m'),
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

  async requestPasswordRecovery(identityNumber: string, channel: 'sms' | 'whatsapp') {
    const normalized = identityNumber.trim();
    if (!normalized) {
      throw new BadRequestException('La CI es obligatoria');
    }

    const user = await this.usersService.findByIdentityNumber(normalized);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const phone = (user.phone ?? '').trim();
    if (!phone) {
      throw new BadRequestException('No existe un telefono registrado');
    }

    const ttlMs = parseDurationToMs(
      process.env.PASSWORD_RECOVERY_EXPIRES_IN,
      DEFAULT_RECOVERY_TTL_MS,
    );
    const expiresAt = new Date(Date.now() + ttlMs);
    const code = randomInt(100000, 999999).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await this.passwordResetRepository.update(
      { userId: user.userId, usedAt: IsNull() },
      { usedAt: new Date() },
    );

    const reset = this.passwordResetRepository.create({
      userId: user.userId,
      codeHash,
      deliveryChannel: channel,
      expiresAt,
      usedAt: null,
      attempts: 0,
    });

    await this.passwordResetRepository.save(reset);

    // Placeholder for SMS/WhatsApp provider integration.
    console.log(
      `[PasswordRecovery] Envio a ${phone} via ${channel} codigo ${code}`,
    );

    return {
      maskedPhone: maskPhone(phone),
      expiresAt,
    };
  }

  async resetPasswordWithCode(input: {
    identityNumber: string;
    code: string;
    newPassword: string;
  }) {
    const normalized = input.identityNumber.trim();
    if (!normalized) {
      throw new BadRequestException('La CI es obligatoria');
    }
    if (!input.code?.trim()) {
      throw new BadRequestException('El codigo es obligatorio');
    }
    if (!input.newPassword || input.newPassword.length < 8) {
      throw new BadRequestException(
        'La contrasena debe tener al menos 8 caracteres',
      );
    }

    const user = await this.usersService.findByIdentityNumber(normalized);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const reset = await this.passwordResetRepository.findOne({
      where: { userId: user.userId, usedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    if (!reset) {
      throw new BadRequestException('No existe un codigo valido');
    }

    if (reset.expiresAt.getTime() < Date.now()) {
      await this.passwordResetRepository.update(reset.passwordResetId, {
        usedAt: new Date(),
      });
      throw new BadRequestException('El codigo ha expirado');
    }

    const maxAttempts = parseNumericEnv(
      process.env.PASSWORD_RECOVERY_MAX_ATTEMPTS,
      5,
    );

    const match = await bcrypt.compare(input.code.trim(), reset.codeHash);
    if (!match) {
      const nextAttempts = (reset.attempts ?? 0) + 1;
      await this.passwordResetRepository.update(reset.passwordResetId, {
        attempts: nextAttempts,
        usedAt: nextAttempts >= maxAttempts ? new Date() : null,
      });
      throw new BadRequestException('Codigo invalido');
    }

    await this.usersService.update(user.userId, {
      password: input.newPassword,
    });

    await this.passwordResetRepository.update(reset.passwordResetId, {
      usedAt: new Date(),
    });

    return { ok: true };
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
