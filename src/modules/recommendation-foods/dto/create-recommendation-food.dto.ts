import { IsString, IsUUID } from 'class-validator';

export class CreateRecommendationFoodDto {
  @IsUUID()
  recommendationId!: string;

  @IsUUID()
  foodId!: string;

  @IsString()
  dailyAmount!: string;

  @IsString()
  referenceAge!: string;
}
