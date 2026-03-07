import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from 'src/database/entities';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(History)
    private readonly historiesRepository: Repository<History>,
  ) {}

  async create(dto: CreateHistoryDto): Promise<History> {
    const history = this.historiesRepository.create({
      ...dto,
      consultationId: dto.consultationId ?? null,
      clinicianId: dto.clinicianId ?? null,
      summary: dto.summary ?? null,
    });
    return this.historiesRepository.save(history);
  }

  async findAll(): Promise<History[]> {
    return this.historiesRepository.find({
      relations: { patient: true, consultation: true, clinician: true },
    });
  }
}
