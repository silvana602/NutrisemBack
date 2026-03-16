import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CalculateAnthropometricDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weightKg!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  heightM!: number;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsDateString()
  measuredAt?: string;

  @IsIn(['male', 'female'])
  gender!: 'male' | 'female';
}
