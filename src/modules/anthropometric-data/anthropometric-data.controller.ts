import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnthropometricDataService } from './anthropometric-data.service';
import { CreateAnthropometricDataDto } from './dto/create-anthropometric-data.dto';

@Controller('anthropometric-data')
export class AnthropometricDataController {
  constructor(
    private readonly anthropometricDataService: AnthropometricDataService,
  ) {}

  @Get()
  findAll() {
    return this.anthropometricDataService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAnthropometricDataDto) {
    return this.anthropometricDataService.create(dto);
  }
}
