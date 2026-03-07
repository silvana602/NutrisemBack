import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      identityNumber: dto.identityNumber,
      email: dto.email ?? null,
      phone: dto.phone,
      address: dto.address,
      profilePhoto: dto.profilePhoto ?? null,
      role: dto.role,
      passwordHash: dto.passwordHash,
    });
  }
}
