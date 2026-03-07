import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Antecedent } from 'src/database/entities';
import { CreateAntecedentDto } from './dto/create-antecedent.dto';

@Injectable()
export class AntecedentsService {
  constructor(
    @InjectRepository(Antecedent)
    private readonly antecedentsRepository: Repository<Antecedent>,
  ) {}

  async create(dto: CreateAntecedentDto): Promise<Antecedent> {
    const antecedent = this.antecedentsRepository.create({
      ...dto,
      breastfeeding: dto.breastfeeding ?? null,
      bottleFeeding: dto.bottleFeeding ?? null,
      feedingFrequency: dto.feedingFrequency ?? null,
      foodFrequencyByGroup: dto.foodFrequencyByGroup ?? null,
      recall24h: dto.recall24h ?? null,
      observations: dto.observations ?? null,
    });
    return this.antecedentsRepository.save(antecedent);
  }

  async findAll(): Promise<Antecedent[]> {
    return this.antecedentsRepository.find({
      relations: { consultation: true },
    });
  }
}
