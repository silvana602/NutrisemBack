import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationFood } from 'src/database/entities';
import { RecommendationFoodsController } from './recommendation-foods.controller';
import { RecommendationFoodsService } from './recommendation-foods.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationFood])],
  controllers: [RecommendationFoodsController],
  providers: [RecommendationFoodsService],
  exports: [RecommendationFoodsService],
})
export class RecommendationFoodsModule {}
