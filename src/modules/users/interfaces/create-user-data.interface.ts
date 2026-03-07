import { UserRole } from 'src/common/enums/role.enum';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  identityNumber: string;
  email?: string | null;
  phone: string;
  address: string;
  profilePhoto?: string | null;
  role: UserRole;
  passwordHash: string;
}
