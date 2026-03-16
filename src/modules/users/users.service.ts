import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities';
import { CreateUserData } from './interfaces/create-user-data.interface';
import { UpdateUserData } from './interfaces/update-user-data.interface';

const parseNumericEnv = (
  value: string | undefined,
  fallback: number,
): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(
      password,
      parseNumericEnv(process.env.BCRYPT_SALT_ROUNDS, 10),
    );
  }

  async create(input: CreateUserData): Promise<User> {
    const user = this.usersRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      identityNumber: input.identityNumber,
      email: input.email ?? null,
      phone: input.phone,
      address: input.address,
      profilePhoto: input.profilePhoto ?? null,
      role: input.role,
      passwordHash: await this.hashPassword(input.password),
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByIdentityNumber(identityNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { identityNumber } });
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userId } });
  }

  async update(userId: string, input: UpdateUserData): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) return null;

    if (input.firstName !== undefined) user.firstName = input.firstName;
    if (input.lastName !== undefined) user.lastName = input.lastName;
    if (input.identityNumber !== undefined) {
      user.identityNumber = input.identityNumber;
    }
    if (input.email !== undefined) {
      user.email = input.email ? input.email : null;
    }
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.address !== undefined) user.address = input.address;
    if (input.profilePhoto !== undefined) {
      user.profilePhoto = input.profilePhoto ? input.profilePhoto : null;
    }
    if (input.role !== undefined) user.role = input.role;

    if (input.password) {
      user.passwordHash = await this.hashPassword(input.password);
    }

    return this.usersRepository.save(user);
  }

  async remove(userId: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ userId });
    return (result.affected ?? 0) > 0;
  }
}
