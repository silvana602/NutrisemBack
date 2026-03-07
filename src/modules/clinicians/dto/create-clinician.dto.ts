import { IsString, IsUUID } from 'class-validator';

export class CreateClinicianDto {
  @IsUUID()
  userId!: string;

  @IsString()
  professionalLicense!: string;

  @IsString()
  profession!: string;

  @IsString()
  specialty!: string;

  @IsString()
  residence!: string;

  @IsString()
  institution!: string;
}
