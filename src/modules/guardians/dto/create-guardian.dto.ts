import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateGuardianDto {
  @IsUUID()
  patientId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  identityNumber!: string;

  @IsString()
  address!: string;

  @IsString()
  phone!: string;

  @IsString()
  relationship!: string;

  @IsString()
  @MinLength(8)
  passwordHash!: string;
}
