import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  foodName!: string;

  @IsString()
  category!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  energyKcal!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  proteinG!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fatG!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  carbohydratesG!: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fiberG!: number;

  @IsString()
  vitamins!: string;

  @IsString()
  minerals!: string;

  @IsOptional()
  @IsString()
  servingSize?: string;

  @IsOptional()
  @IsString()
  allergens?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
