import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoriesService } from './histories.service';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get()
  findAll() {
    return this.historiesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateHistoryDto) {
    return this.historiesService.create(dto);
  }
}
