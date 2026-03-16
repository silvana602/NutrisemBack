import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  identityNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @MinLength(8)
  password!: string;
}
