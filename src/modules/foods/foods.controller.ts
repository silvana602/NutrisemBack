import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodsService.create(dto);
  }
}
