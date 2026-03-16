import { Body, Controller, Post } from '@nestjs/common';
import { calculatePediatricAnthropometricResult } from 'src/common/utils/anthropometric.utils';
import { CalculateAnthropometricDto } from './dto/calculate-anthropometric.dto';

@Controller('calculations')
export class CalculationsController {
  @Post('anthropometric')
  calculateAnthropometric(@Body() dto: CalculateAnthropometricDto) {
    return calculatePediatricAnthropometricResult({
      weightKg: dto.weightKg,
      heightM: dto.heightM,
      birthDate: dto.birthDate,
      gender: dto.gender,
      measuredAt: dto.measuredAt,
    });
  }
}
