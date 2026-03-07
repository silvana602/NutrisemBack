import { Body, Controller, Get, Post } from '@nestjs/common';
import { AntecedentsService } from './antecedents.service';
import { CreateAntecedentDto } from './dto/create-antecedent.dto';

@Controller('antecedents')
export class AntecedentsController {
  constructor(private readonly antecedentsService: AntecedentsService) {}

  @Get()
  findAll() {
    return this.antecedentsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateAntecedentDto) {
    return this.antecedentsService.create(dto);
  }
}
