import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateDiagnosisDto {
  @IsUUID()
  consultationId!: string;

  @IsUUID()
  medicalHistoryId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  bmi?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  zScorePercentile?: number;

  @IsString()
  nutritionalDiagnosis!: string;

  @IsString()
  diagnosisDetails!: string;
}
