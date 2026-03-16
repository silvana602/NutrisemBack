import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CliniciansModule } from '../clinicians/clinicians.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.estrategy';

@Module({
  imports: [UsersModule, CliniciansModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
