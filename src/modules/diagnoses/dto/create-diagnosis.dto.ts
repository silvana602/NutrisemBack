import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateDiagnosisDto {
  @IsUUID()
  consultationId!: string;

  @IsUUID()
  medicalHistoryId!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  bmi!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  zScorePercentile!: number;

  @IsString()
  nutritionalDiagnosis!: string;

  @IsString()
  diagnosisDetails!: string;
}
