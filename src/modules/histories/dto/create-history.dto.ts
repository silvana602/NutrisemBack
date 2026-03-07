import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHistoryDto {
  @IsUUID()
  patientId!: string;

  @IsDateString()
  creationDate!: string;

  @IsOptional()
  @IsUUID()
  consultationId?: string;

  @IsOptional()
  @IsUUID()
  clinicianId?: string;

  @IsOptional()
  @IsString()
  summary?: string;
}
