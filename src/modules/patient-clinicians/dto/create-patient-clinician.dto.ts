import { IsUUID } from 'class-validator';

export class CreatePatientClinicianDto {
  @IsUUID()
  patientId!: string;

  @IsUUID()
  clinicianId!: string;
}
