import { UserRole } from 'src/common/enums/role.enum';
import { User } from 'src/database/entities';

export type UserResponse = {
  userId: string;
  firstName: string;
  lastName: string;
  identityNumber: string;
  email?: string;
  phone: string;
  address: string;
  profilePhoto?: string | null;
  role: UserRole;
  password: string;
};

export const toUserResponse = (user: User): UserResponse => ({
  userId: user.userId,
  firstName: user.firstName,
  lastName: user.lastName,
  identityNumber: user.identityNumber,
  email: user.email ?? undefined,
  phone: user.phone,
  address: user.address,
  profilePhoto: user.profilePhoto ?? null,
  role: user.role,
  password: '',
});
