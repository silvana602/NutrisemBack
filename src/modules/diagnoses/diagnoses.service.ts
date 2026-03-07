import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnosis } from 'src/database/entities';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';

@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnosis)
    private readonly diagnosesRepository: Repository<Diagnosis>,
  ) {}

  async create(dto: CreateDiagnosisDto): Promise<Diagnosis> {
    const diagnosis = this.diagnosesRepository.create({
      ...dto,
      bmi: dto.bmi.toString(),
      zScorePercentile: dto.zScorePercentile.toString(),
    });
    return this.diagnosesRepository.save(diagnosis);
  }

  async findAll(): Promise<Diagnosis[]> {
    return this.diagnosesRepository.find({
      relations: { consultation: true, medicalHistory: true },
    });
  }
}
