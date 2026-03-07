import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProgress } from 'src/database/entities';
import { CreatePatientProgressDto } from './dto/create-patient-progress.dto';

@Injectable()
export class PatientProgressService {
  constructor(
    @InjectRepository(PatientProgress)
    private readonly patientProgressRepository: Repository<PatientProgress>,
  ) {}

  async create(dto: CreatePatientProgressDto): Promise<PatientProgress> {
    const patientProgress = this.patientProgressRepository.create({
      patientId: dto.patientId,
      progressDate: dto.progressDate,
      weightKg: dto.weightKg.toString(),
      heightCm: dto.heightCm.toString(),
      bmi: dto.bmi.toString(),
    });
    return this.patientProgressRepository.save(patientProgress);
  }

  async findAll(): Promise<PatientProgress[]> {
    return this.patientProgressRepository.find({
      relations: { patient: true },
    });
  }
}
