import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClinicalDataService } from './clinical-data.service';
import { CreateClinicalDataDto } from './dto/create-clinical-data.dto';

@Controller('clinical-data')
export class ClinicalDataController {
  constructor(private readonly clinicalDataService: ClinicalDataService) {}

  @Get()
  findAll() {
    return this.clinicalDataService.findAll();
  }

  @Post()
  create(@Body() dto: CreateClinicalDataDto) {
    return this.clinicalDataService.create(dto);
  }
}
