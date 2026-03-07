import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePatientClinicianDto } from './dto/create-patient-clinician.dto';
import { PatientCliniciansService } from './patient-clinicians.service';

@Controller('patient-clinicians')
export class PatientCliniciansController {
  constructor(
    private readonly patientCliniciansService: PatientCliniciansService,
  ) {}

  @Get()
  findAll() {
    return this.patientCliniciansService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePatientClinicianDto) {
    return this.patientCliniciansService.create(dto);
  }
}
