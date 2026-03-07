import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationsService } from './consultations.service';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  findAll() {
    return this.consultationsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(dto);
  }
}
