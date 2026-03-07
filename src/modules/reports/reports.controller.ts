import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }
}
