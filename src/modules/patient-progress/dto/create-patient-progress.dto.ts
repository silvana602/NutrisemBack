import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsPositive, IsUUID } from 'class-validator';

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

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  bmi!: number;
}
