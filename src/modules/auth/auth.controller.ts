import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CliniciansService } from './clinicians.service';
import { CreateClinicianDto } from './dto/create-clinician.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('clinicians')
@UseGuards(JwtAuthGuard)
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
