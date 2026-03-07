import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationFood } from 'src/database/entities';
import { CreateRecommendationFoodDto } from './dto/create-recommendation-food.dto';

@Injectable()
export class RecommendationFoodsService {
  constructor(
    @InjectRepository(RecommendationFood)
    private readonly recommendationFoodsRepository: Repository<RecommendationFood>,
  ) {}

  async create(dto: CreateRecommendationFoodDto): Promise<RecommendationFood> {
    const recommendationFood = this.recommendationFoodsRepository.create(dto);
    return this.recommendationFoodsRepository.save(recommendationFood);
  }

  async findAll(): Promise<RecommendationFood[]> {
    return this.recommendationFoodsRepository.find({
      relations: { recommendation: true, food: true },
    });
  }
}
