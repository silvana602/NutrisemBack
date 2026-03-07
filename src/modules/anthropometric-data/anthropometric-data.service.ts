import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnthropometricData } from 'src/database/entities';
import { CreateAnthropometricDataDto } from './dto/create-anthropometric-data.dto';

@Injectable()
export class AnthropometricDataService {
  constructor(
    @InjectRepository(AnthropometricData)
    private readonly anthropometricDataRepository: Repository<AnthropometricData>,
  ) {}

  async create(dto: CreateAnthropometricDataDto): Promise<AnthropometricData> {
    const anthropometricData = this.anthropometricDataRepository.create({
      consultationId: dto.consultationId,
      weightKg: dto.weightKg.toString(),
      heightM: dto.heightM.toString(),
      muacCm: dto.muacCm.toString(),
      headCircumferenceCm: dto.headCircumferenceCm.toString(),
      bmi: dto.bmi?.toString() ?? null,
      zScore: dto.zScore?.toString() ?? null,
      percentile: dto.percentile?.toString() ?? null,
    });
    return this.anthropometricDataRepository.save(anthropometricData);
  }

  async findAll(): Promise<AnthropometricData[]> {
    return this.anthropometricDataRepository.find({
      relations: { consultation: true },
    });
  }
}
