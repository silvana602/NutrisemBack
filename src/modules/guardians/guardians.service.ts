import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guardian } from 'src/database/entities';
import { CreateGuardianDto } from './dto/create-guardian.dto';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardiansRepository: Repository<Guardian>,
  ) {}

  async create(dto: CreateGuardianDto): Promise<Guardian> {
    const guardian = this.guardiansRepository.create(dto);
    return this.guardiansRepository.save(guardian);
  }

  async findAll(): Promise<Guardian[]> {
    return this.guardiansRepository.find({ relations: { patient: true } });
  }
}
