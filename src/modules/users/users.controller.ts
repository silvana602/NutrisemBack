import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { toUserResponse } from './users.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(toUserResponse);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    return user ? toUserResponse(user) : null;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findByUserId(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return toUserResponse(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      identityNumber: dto.identityNumber,
      email: dto.email ?? null,
      phone: dto.phone,
      address: dto.address,
      profilePhoto: dto.profilePhoto ?? null,
      role: dto.role,
      password: dto.password,
    });

    return toUserResponse(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      identityNumber: dto.identityNumber,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      profilePhoto: dto.profilePhoto,
      role: dto.role,
      password: dto.password,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return toUserResponse(user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.usersService.remove(id);
    if (!removed) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { message: 'Usuario eliminado' };
  }
}
