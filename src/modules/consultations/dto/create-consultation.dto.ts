import { IsDateString, IsString, IsUUID, Matches } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  patientId!: string;

  @IsUUID()
  clinicianId!: string;

  @IsDateString()
  consultationDate!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  consultationTime!: string;
}
