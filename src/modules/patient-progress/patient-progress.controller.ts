import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePatientProgressDto } from './dto/create-patient-progress.dto';
import { PatientProgressService } from './patient-progress.service';

@Controller('patient-progress')
export class PatientProgressController {
  constructor(
    private readonly patientProgressService: PatientProgressService,
  ) {}

  @Get()
  findAll() {
    return this.patientProgressService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePatientProgressDto) {
    return this.patientProgressService.create(dto);
  }
}
