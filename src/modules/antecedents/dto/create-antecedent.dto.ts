import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAntecedentDto {
  @IsUUID()
  consultationId!: string;

  @IsOptional()
  @IsString()
  breastfeeding?: string;

  @IsOptional()
  @IsString()
  bottleFeeding?: string;

  @IsOptional()
  @IsString()
  feedingFrequency?: string;

  @IsOptional()
  @IsObject()
  foodFrequencyByGroup?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  recall24h?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  observations?: string;
}
