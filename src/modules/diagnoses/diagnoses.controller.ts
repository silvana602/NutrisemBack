import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { DiagnosesService } from './diagnoses.service';

@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @Get()
  findAll() {
    return this.diagnosesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateDiagnosisDto) {
    return this.diagnosesService.create(dto);
  }
}
