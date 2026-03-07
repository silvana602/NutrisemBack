import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from 'src/database/entities';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationsRepository: Repository<Recommendation>,
  ) {}

  async create(dto: CreateRecommendationDto): Promise<Recommendation> {
    const recommendation = this.recommendationsRepository.create(dto);
    return this.recommendationsRepository.save(recommendation);
  }

  async findAll(): Promise<Recommendation[]> {
    return this.recommendationsRepository.find({
      relations: { diagnosis: true },
    });
  }
}
