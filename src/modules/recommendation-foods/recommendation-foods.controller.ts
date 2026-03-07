import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRecommendationFoodDto } from './dto/create-recommendation-food.dto';
import { RecommendationFoodsService } from './recommendation-foods.service';

@Controller('recommendation-foods')
export class RecommendationFoodsController {
  constructor(
    private readonly recommendationFoodsService: RecommendationFoodsService,
  ) {}

  @Get()
  findAll() {
    return this.recommendationFoodsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateRecommendationFoodDto) {
    return this.recommendationFoodsService.create(dto);
  }
}
