import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CliniciansModule } from '../clinicians/clinicians.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.estrategy';
import { PasswordReset } from 'src/database/entities';

@Module({
  imports: [UsersModule, CliniciansModule, PassportModule, JwtModule.register({}), TypeOrmModule.forFeature([PasswordReset])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
