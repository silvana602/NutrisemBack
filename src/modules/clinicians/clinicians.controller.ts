import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateClinicianDto } from './dto/create-clinician.dto';
import { CliniciansService } from './clinicians.service';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Get()
  findAll() {
    return this.cliniciansService.findAll();
  }

  @Post()
  create(@Body() dto: CreateClinicianDto) {
    return this.cliniciansService.create(dto);
  }
}
