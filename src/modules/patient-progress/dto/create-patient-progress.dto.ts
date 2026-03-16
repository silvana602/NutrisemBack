import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreatePatientProgressDto {
  @IsUUID()
  patientId!: string;

  @IsDateString()
  progressDate!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weightKg!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  heightCm!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  bmi?: number;
}
