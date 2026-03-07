import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { GuardiansService } from './guardians.service';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get()
  findAll() {
    return this.guardiansService.findAll();
  }

  @Post()
  create(@Body() dto: CreateGuardianDto) {
    return this.guardiansService.create(dto);
  }
}
