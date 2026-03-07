import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from 'src/database/entities';
import { CreateFoodDto } from './dto/create-food.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodsRepository: Repository<Food>,
  ) {}

  async create(dto: CreateFoodDto): Promise<Food> {
    const food = this.foodsRepository.create({
      ...dto,
      energyKcal: dto.energyKcal.toString(),
      proteinG: dto.proteinG.toString(),
      fatG: dto.fatG.toString(),
      carbohydratesG: dto.carbohydratesG.toString(),
      fiberG: dto.fiberG.toString(),
      servingSize: dto.servingSize ?? null,
      allergens: dto.allergens ?? null,
      notes: dto.notes ?? null,
    });
    return this.foodsRepository.save(food);
  }

  async findAll(): Promise<Food[]> {
    return this.foodsRepository.find();
  }
}
