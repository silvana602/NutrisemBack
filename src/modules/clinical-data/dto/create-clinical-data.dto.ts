import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClinicalDataDto {
  @IsUUID()
  consultationId!: string;

  @IsOptional()
  @IsString()
  mainConsultationReason?: string;

  @IsOptional()
  @IsString()
  informantType?: string;

  @IsOptional()
  @IsString()
  informantName?: string;

  @IsOptional()
  @IsString()
  informantRelationship?: string;

  @IsOptional()
  @IsObject()
  alarmSigns?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  activityLevel?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  apathy?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  generalObservations?: string;

  @IsOptional()
  @IsString()
  observations?: string;
}
