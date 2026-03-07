import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { Gender } from 'src/database/enums';

export class CreatePatientDto {
  @IsUUID()
  userId!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  identityNumber!: string;

  @IsDateString()
  birthDate!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  address!: string;
}
