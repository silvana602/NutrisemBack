import { IsString, IsUUID } from 'class-validator';

export class CreateRecommendationDto {
  @IsUUID()
  diagnosisId!: string;

  @IsString()
  medicalRecommendation!: string;

  @IsString()
  dietaryRecommendation!: string;
}
